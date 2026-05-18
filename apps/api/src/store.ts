import crypto from "node:crypto";
import type {
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
  audit("line.link_start", customerId);
  return link;
}

export function completeLineLink(input: {
  token: string;
  lineUserId: string;
  displayName?: string;
}) {
  const link = db.lineConnections.find((item) => item.token === input.token);
  if (!link) return { error: "not_found" as const };
  if (link.usedAt) return { error: "used" as const };
  if (Date.parse(link.expiresAt) < Date.now()) {
    link.status = "expired";
    return { error: "expired" as const };
  }
  link.lineUserId = input.lineUserId;
  link.displayName = input.displayName;
  link.usedAt = now();
  link.status = "linked";
  updateSetupStatus(link.customerId);
  audit("line.link_complete", link.customerId);
  return { link };
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
  return notification;
}

export function audit(action: string, customerId?: string) {
  db.auditLogs.unshift({ id: uid("audit"), action, customerId, createdAt: now() });
}
