import crypto from "node:crypto";
import type {
  AutomationJobRecord,
  AutomationJobStatus,
  AutomationJobType,
  BotnoiMappingRecord,
  CustomerRecord,
  ElderProfileRecord,
  LineConnectionRecord,
  NotificationPayloadRecord,
  SetupStatus,
} from "./contracts.js";

const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

export const db = {
  customers: [] as CustomerRecord[],
  elders: [] as ElderProfileRecord[],
  lineConnections: [] as LineConnectionRecord[],
  botnoiMappings: [] as BotnoiMappingRecord[],
  notifications: [] as NotificationPayloadRecord[],
  automationJobs: [] as AutomationJobRecord[],
  auditLogs: [] as Array<{ id: string; action: string; customerId?: string; createdAt: string }>,
};

export function createCustomer(input: {
  payerName: string;
  phone: string;
  email?: string;
  planId: string;
}) {
  const customer: CustomerRecord = {
    id: uid("cus"),
    payerName: input.payerName,
    phone: input.phone,
    email: input.email,
    planId: input.planId,
    setupStatus: "waiting_line",
    createdAt: now(),
  };
  db.customers.unshift(customer);
  audit("checkout.mock_complete", customer.id);
  return customer;
}

export function createElder(input: {
  customerId: string;
  name: string;
  nickname?: string;
  phone: string;
  relationship: string;
  note?: string;
  consentGranted: boolean;
}) {
  const elder: ElderProfileRecord = {
    id: uid("elder"),
    customerId: input.customerId,
    name: input.name,
    nickname: input.nickname,
    phone: input.phone,
    relationship: input.relationship,
    note: input.note,
    consentGranted: input.consentGranted,
    createdAt: now(),
  };
  db.elders.unshift(elder);
  audit("onboarding.service_request", input.customerId);
  return elder;
}

export function createLineLink(customerId: string) {
  for (const existing of db.lineConnections) {
    if (existing.customerId === customerId && existing.status === "pending") {
      existing.status = "expired";
    }
  }
  const token = crypto.randomBytes(18).toString("base64url");
  const link: LineConnectionRecord = {
    id: uid("line"),
    customerId,
    token,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: "pending",
    createdAt: now(),
  };
  db.lineConnections.unshift(link);
  audit("line.link_started", customerId);
  createAutomationJob({
    type: "line_link_expire_check",
    customerId,
    scheduledAt: link.expiresAt,
    payload: { lineConnectionId: link.id },
  });
  return link;
}

export function completeLineLink(input: {
  token: string;
  lineUserId: string;
  displayName?: string;
  pictureUrl?: string;
}) {
  const link = db.lineConnections.find((item) => item.token === input.token);
  if (!link) return { error: "not_found" as const };
  if (link.usedAt) return { error: "used" as const };
  if (Date.parse(link.expiresAt) < Date.now()) {
    link.status = "expired";
    audit("line.link_expired", link.customerId);
    return { error: "expired" as const };
  }
  link.lineUserId = input.lineUserId;
  link.displayName = input.displayName;
  link.pictureUrl = input.pictureUrl;
  link.usedAt = now();
  link.linkedAt = link.usedAt;
  link.status = "linked";
  updateSetupStatus(link.customerId);
  audit("line.link_completed", link.customerId);
  createAutomationJob({
    type: "botnoi_contact_sync",
    customerId: link.customerId,
    scheduledAt: now(),
    payload: { lineConnectionId: link.id, lineUserId: input.lineUserId },
  });
  createAutomationJob({
    type: "call_schedule_create",
    customerId: link.customerId,
    scheduledAt: now(),
    payload: { lineConnectionId: link.id },
  });
  return { link };
}

export function getLineLinkStatus(linkId: string) {
  const link = db.lineConnections.find((item) => item.id === linkId);
  if (!link) return { error: "not_found" as const };
  if (link.status === "pending" && Date.parse(link.expiresAt) < Date.now()) {
    link.status = "expired";
    audit("line.link_expired", link.customerId);
  }
  return {
    linkId: link.id,
    customerId: link.customerId,
    status: link.status,
    expiresAt: link.expiresAt,
    linkedAt: link.linkedAt,
    displayName: link.displayName,
    pictureUrl: link.pictureUrl,
  };
}

export function upsertBotnoiMapping(input: {
  customerId: string;
  elderProfileId?: string;
  botnoiBotId: string;
  botnoiContactId: string;
}) {
  const existing = db.botnoiMappings.find(
    (item) =>
      item.customerId === input.customerId && item.botnoiContactId === input.botnoiContactId,
  );
  if (existing) {
    existing.botnoiBotId = input.botnoiBotId;
    existing.elderProfileId = input.elderProfileId;
    existing.status = "active";
    existing.updatedAt = now();
    updateSetupStatus(input.customerId);
    audit("admin.botnoi_mapping_update", input.customerId);
    return existing;
  }
  const mapping: BotnoiMappingRecord = {
    id: uid("map"),
    customerId: input.customerId,
    elderProfileId: input.elderProfileId,
    botnoiBotId: input.botnoiBotId,
    botnoiContactId: input.botnoiContactId,
    status: "active",
    updatedAt: now(),
  };
  db.botnoiMappings.unshift(mapping);
  updateSetupStatus(input.customerId);
  audit("admin.botnoi_mapping_create", input.customerId);
  return mapping;
}

export function updateSetupStatus(customerId: string): SetupStatus {
  const customer = db.customers.find((item) => item.id === customerId);
  if (!customer) return "waiting_line";
  const hasLine = db.lineConnections.some(
    (item) => item.customerId === customerId && item.status === "linked",
  );
  const hasBotnoi = db.botnoiMappings.some(
    (item) => item.customerId === customerId && item.status === "active",
  );
  customer.setupStatus =
    hasLine && hasBotnoi ? "ready" : hasLine ? "waiting_botnoi" : "waiting_line";
  return customer.setupStatus;
}

export function createNotification(input: Omit<NotificationPayloadRecord, "id" | "createdAt">) {
  const notification: NotificationPayloadRecord = {
    ...input,
    id: uid("noti"),
    createdAt: now(),
  };
  db.notifications.unshift(notification);
  audit("botnoi.call_feedback", input.customerId);
  createAutomationJob({
    type: "line_push_send",
    customerId: input.customerId,
    scheduledAt: now(),
    payload: { notificationId: notification.id, alertLevel: notification.alertLevel },
  });
  return notification;
}

export function createAutomationJob(input: {
  type: AutomationJobType;
  customerId?: string;
  elderProfileId?: string;
  scheduledAt?: string;
  payload?: Record<string, unknown>;
  maxAttempts?: number;
}) {
  const job: AutomationJobRecord = {
    id: uid("job"),
    type: input.type,
    status: "queued",
    customerId: input.customerId,
    elderProfileId: input.elderProfileId,
    scheduledAt: input.scheduledAt ?? now(),
    attemptCount: 0,
    maxAttempts: input.maxAttempts ?? 3,
    payload: input.payload ?? {},
    createdAt: now(),
    updatedAt: now(),
  };
  db.automationJobs.unshift(job);
  audit(`automation.${input.type}.queued`, input.customerId);
  return job;
}

export function listAutomationJobs(status?: AutomationJobStatus) {
  return status ? db.automationJobs.filter((job) => job.status === status) : db.automationJobs;
}

export function retryAutomationJob(jobId: string) {
  const job = db.automationJobs.find((item) => item.id === jobId);
  if (!job) return { error: "not_found" as const };
  if (job.status === "cancelled" || job.status === "running") {
    return { error: "not_retryable" as const };
  }
  job.status = "queued";
  job.scheduledAt = now();
  job.lastError = undefined;
  job.updatedAt = now();
  audit(`automation.${job.type}.retry`, job.customerId);
  return { job };
}

export function cancelAutomationJob(jobId: string) {
  const job = db.automationJobs.find((item) => item.id === jobId);
  if (!job) return { error: "not_found" as const };
  if (job.status === "success") return { error: "already_completed" as const };
  job.status = "cancelled";
  job.finishedAt = now();
  job.updatedAt = now();
  audit(`automation.${job.type}.cancelled`, job.customerId);
  return { job };
}

export function runDueAutomationJobs() {
  const runnable = db.automationJobs.filter(
    (job) =>
      (job.status === "queued" || job.status === "retrying") &&
      Date.parse(job.scheduledAt) <= Date.now(),
  );
  const results = runnable.map((job) => runAutomationJob(job));
  return { total: results.length, results };
}

function runAutomationJob(job: AutomationJobRecord) {
  job.status = "running";
  job.startedAt = now();
  job.attemptCount += 1;
  job.updatedAt = now();

  if (job.type === "line_link_expire_check") {
    const lineConnectionId = String(job.payload.lineConnectionId ?? "");
    const link = db.lineConnections.find((item) => item.id === lineConnectionId);
    if (link?.status === "pending" && Date.parse(link.expiresAt) < Date.now()) {
      link.status = "expired";
      audit("line.link_expired", link.customerId);
    }
    finishJob(job, "success");
    return { jobId: job.id, status: job.status };
  }

  if (
    job.type === "botnoi_contact_sync" ||
    job.type === "call_schedule_create" ||
    job.type === "line_push_send" ||
    job.type === "weekly_report_send" ||
    job.type === "retry_failed_notification"
  ) {
    job.lastError = "External LINE/Botnoi credentials are not configured yet.";
    finishJob(job, "blocked");
    return { jobId: job.id, status: job.status, lastError: job.lastError };
  }

  finishJob(job, "success");
  return { jobId: job.id, status: job.status };
}

function finishJob(job: AutomationJobRecord, status: AutomationJobStatus) {
  job.status = status;
  job.finishedAt = now();
  job.updatedAt = now();
  audit(`automation.${job.type}.${status}`, job.customerId);
}

export function audit(action: string, customerId?: string) {
  db.auditLogs.unshift({ id: uid("audit"), action, customerId, createdAt: now() });
}
