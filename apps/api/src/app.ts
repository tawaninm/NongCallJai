import crypto from "node:crypto";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { getLiffBaseUrl, isConfiguredEnv, readConfiguredEnv } from "./config.js";
import type {
  AlertLevel,
  ApiResponse,
  AutomationJobStatus,
  AutomationJobType,
} from "./contracts.js";
import { connectDb, getMongoStatus } from "./db.js";
import {
  AuditLogModel,
  AutomationJobModel,
  BotnoiMappingModel,
  CallFeedbackLogModel,
  CustomerModel,
  ElderProfileModel,
  LineConnectionModel,
  NotificationLogModel,
  SubscriptionModel,
} from "./models.js";

type RawBodyRequest = Request & { rawBody?: Buffer };
type LooseDoc = Record<string, unknown> & {
  _id?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  toObject?: () => Record<string, unknown>;
};

const safeNote =
  "NongCallJai is a family check-in and summary service. It does not diagnose, prescribe, or change medication. If symptoms are severe, contact an appropriate medical professional or emergency channel.";

const plans = [
  {
    id: "basic",
    name: "Basic",
    priceThb: 300,
    billingCycle: "monthly",
    callQuotaLabel: "Daily voice check-in for one elder",
    features: [
      "Daily voice bot check-in",
      "Family summary delivery",
      "Gentle medication reminders",
      "Supports one elder profile",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    priceThb: 590,
    billingCycle: "monthly",
    callQuotaLabel: "Multiple check-in windows plus LINE chatbot",
    features: [
      "Everything in Basic",
      "Family LINE chatbot",
      "Weekly summary",
      "Adjustable question set",
    ],
    highlighted: true,
  },
  {
    id: "family",
    name: "Family",
    priceThb: 990,
    billingCycle: "monthly",
    callQuotaLabel: "Care for up to three elder profiles",
    features: [
      "Multiple profiles",
      "Shared caregivers",
      "Urgent family alerts",
      "Monthly care summary",
    ],
  },
];

const apiEndpointCatalog = [
  {
    group: "LINE QR Connect",
    method: "POST",
    path: "/api/line/link/start",
    auth: "family-session",
    description: "Create a one-time LIFF URL for QR linking.",
    sampleBody: { customerId: "cus_xxxxxxxx" },
  },
  {
    group: "LINE QR Connect",
    method: "GET",
    path: "/api/line/link/status?linkId=line_xxxxxxxx",
    auth: "family-session",
    description: "Poll a QR linking status.",
  },
  {
    group: "LINE QR Connect",
    method: "POST",
    path: "/api/line/link/complete",
    auth: "LIFF profile",
    description: "Complete LINE linking from LIFF profile data.",
    sampleBody: {
      token: "one-time-token",
      lineUserId: "Uxxxxxxxx",
      displayName: "Caregiver",
      pictureUrl: "https://profile.line-scdn.net/...",
    },
  },
  {
    group: "Voicebot/Botnoi",
    method: "GET",
    path: "/api/botnoi/elder/:phone",
    auth: "botnoi-webhook-secret",
    description: "Fetch elder profile data for Botnoi before an outbound call.",
  },
  {
    group: "Voicebot/Botnoi",
    method: "GET",
    path: "/api/botnoi/next-call",
    auth: "botnoi-webhook-secret",
    description: "Fetch the next mapped elder that has not received a call today.",
  },
  {
    group: "Voicebot/Botnoi",
    method: "POST",
    path: "/api/botnoi/call-feedback",
    auth: "botnoi-webhook-secret",
    description: "Receive Botnoi call feedback and queue family notification work.",
    sampleBody: {
      botnoiBotId: "botnoi-bot-001",
      botnoiContactId: "contact-elder-001",
      callStatus: "answered",
      startedAt: "2026-05-18T09:00:00+07:00",
      summary: "Family-safe summary text",
      tags: { meal: true, medication_status: true },
    },
  },
  {
    group: "LINE Messaging API",
    method: "POST",
    path: "/api/line/webhook",
    auth: "LINE x-line-signature",
    description: "Receive LINE OA webhook events with signature verification.",
    sampleHeaders: { "x-line-signature": "<computed-by-line>" },
    sampleBody: {
      destination: "Uxxxxxxxx",
      events: [{ type: "follow", source: { type: "user", userId: "Uxxxxxxxx" } }],
    },
  },
  {
    group: "LINE Messaging API",
    method: "POST",
    path: "/api/line/push-test",
    auth: "admin",
    description: "Create a safe test notification and queue LINE push delivery.",
    sampleBody: {
      customerId: "cus_xxxxxxxx",
      elderName: "Khun Mae",
      title: "NongCallJai call summary",
      summary: "Family-safe summary text",
      alertLevel: "info",
    },
  },
  {
    group: "Automation",
    method: "GET",
    path: "/api/admin/automation/jobs",
    auth: "admin",
    description: "List persisted automation jobs.",
  },
  {
    group: "Automation",
    method: "POST",
    path: "/api/admin/automation/run-now",
    auth: "admin",
    description: "Run due automation jobs immediately.",
  },
  {
    group: "Automation",
    method: "GET",
    path: "/api/admin/automation/health",
    auth: "admin",
    description: "Check persisted queue counts and integration configuration.",
  },
];

const checkoutSchema = z.object({
  payerName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  planId: z.string().min(1),
});

const onboardingSchema = z.object({
  customerId: z.string().min(1),
  name: z.string().min(1),
  nickname: z.string().optional(),
  phone: z.string().min(6),
  relationship: z.string().min(1),
  age: z.number().optional(),
  note: z.string().optional(),
  consentGranted: z.boolean(),
});

const lineWebhookSchema = z.object({
  destination: z.string().optional(),
  events: z
    .array(
      z
        .object({
          type: z.string().min(1),
          timestamp: z.number().optional(),
          replyToken: z.string().optional(),
          source: z
            .object({
              type: z.string().optional(),
              userId: z.string().optional(),
              groupId: z.string().optional(),
              roomId: z.string().optional(),
            })
            .passthrough()
            .optional(),
        })
        .passthrough(),
    )
    .default([]),
});

const linePushTestSchema = z.object({
  customerId: z.string().min(1),
  elderName: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  alertLevel: z.enum(["info", "watch", "urgent"]).default("info"),
  audioUrl: z.string().url().optional(),
  safeNote: z.string().min(1).default(safeNote),
});

const callFeedbackSchema = z.object({
  botnoiBotId: z.string().min(1),
  botnoiContactId: z.string().min(1),
  callStatus: z.enum(["answered", "missed", "failed"]),
  startedAt: z.string().min(1),
  summary: z.string().optional(),
  transcript: z.string().optional(),
  audioUrl: z.string().url().optional(),
  tags: z
    .object({
      symptom: z.string().optional(),
      meal: z.boolean().optional(),
      meal_detail: z.string().optional(),
      medication_status: z.boolean().optional(),
      medication_detail: z.string().optional(),
      today_activity: z.string().optional(),
      caring_message: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

function ok<T>(data: T, meta?: ApiResponse<T>["meta"]): ApiResponse<T> {
  return { ok: true, data, meta };
}

function fail(code: string, message: string, details?: unknown): ApiResponse<never> {
  return { ok: false, error: { code, message, details } };
}

function route<T>(
  handler: (req: Request) => T | Promise<T>,
  options: { db?: boolean } = { db: true },
) {
  return async (req: Request, res: Response) => {
    try {
      if (options.db !== false) {
        await connectDb();
      }
      const data = await handler(req);
      res.json(ok(data));
    } catch (error) {
      sendError(res, error);
    }
  };
}

function sendError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    res.status(400).json(fail("VALIDATION_ERROR", "Invalid request payload", error.flatten()));
    return;
  }
  if (error instanceof ApiError) {
    res.status(error.status).json(fail(error.code, error.message, error.details));
    return;
  }
  const message = error instanceof Error ? error.message : "Unexpected API error";
  res.status(500).json(fail("INTERNAL_ERROR", message));
}

function doc(input: unknown): LooseDoc {
  if (
    input &&
    typeof input === "object" &&
    "toObject" in input &&
    typeof (input as LooseDoc).toObject === "function"
  ) {
    return (input as LooseDoc).toObject?.() ?? {};
  }
  return (input ?? {}) as LooseDoc;
}

function idOf(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function maybeId(value: unknown) {
  const id = idOf(value);
  return id || undefined;
}

function objectId(value: string, label = "id") {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(400, "INVALID_ID", `Invalid ${label}`);
  }
  return new Types.ObjectId(value);
}

function iso(value: unknown) {
  if (!value) return undefined;
  return new Date(value as string | Date).toISOString();
}

function requiredIso(value: unknown) {
  return iso(value) ?? new Date().toISOString();
}

function serializeCustomer(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    payerName: String(item.payerName ?? ""),
    phone: String(item.phone ?? ""),
    email: item.email ? String(item.email) : undefined,
    planId: String(item.planId ?? ""),
    setupStatus: String(item.setupStatus ?? "waiting_line"),
    createdAt: requiredIso(item.createdAt),
  };
}

function serializeElder(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    customerId: idOf(item.customerId),
    name: String(item.name ?? ""),
    nickname: item.nickname ? String(item.nickname) : undefined,
    phone: String(item.phone ?? ""),
    relationship: String(item.relationship ?? item.relatives ?? ""),
    age: typeof item.age === "number" ? item.age : undefined,
    note: item.note ? String(item.note) : item.careNote ? String(item.careNote) : undefined,
    consentGranted: Boolean(item.consentGranted),
    createdAt: requiredIso(item.createdAt),
  };
}

function serializeLineConnection(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    linkId: idOf(item._id),
    customerId: idOf(item.customerId),
    token: String(item.token ?? ""),
    expiresAt: requiredIso(item.expiresAt),
    status: String(item.status ?? "pending"),
    lineUserId: item.lineUserId ? String(item.lineUserId) : undefined,
    displayName: item.displayName ? String(item.displayName) : undefined,
    pictureUrl: item.pictureUrl ? String(item.pictureUrl) : undefined,
    usedAt: iso(item.usedAt),
    linkedAt: iso(item.linkedAt),
  };
}

function serializeBotnoiMapping(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    customerId: idOf(item.customerId),
    elderProfileId: maybeId(item.elderProfileId),
    botnoiBotId: String(item.botnoiBotId ?? ""),
    botnoiContactId: String(item.botnoiContactId ?? ""),
    status: String(item.status ?? "active"),
    updatedAt: requiredIso(item.updatedAt),
  };
}

function serializeNotification(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    customerId: idOf(item.customerId),
    elderName: String(item.elderName ?? ""),
    title: String(item.title ?? ""),
    summary: String(item.summary ?? ""),
    alertLevel: String(item.alertLevel ?? "info"),
    audioUrl: item.audioUrl ? String(item.audioUrl) : undefined,
    safeNote: String(item.safeNote ?? safeNote),
    deliveryStatus: String(item.deliveryStatus ?? "pending"),
    lineMessageId: item.lineMessageId ? String(item.lineMessageId) : undefined,
    sentAt: iso(item.sentAt),
    createdAt: requiredIso(item.createdAt),
  };
}

function serializeJob(input: unknown) {
  const item = doc(input);
  return {
    id: idOf(item._id),
    type: String(item.type ?? ""),
    status: String(item.status ?? "queued"),
    customerId: maybeId(item.customerId),
    elderProfileId: maybeId(item.elderProfileId),
    scheduledAt: requiredIso(item.scheduledAt),
    startedAt: iso(item.startedAt),
    finishedAt: iso(item.finishedAt),
    attemptCount: Number(item.attemptCount ?? 0),
    maxAttempts: Number(item.maxAttempts ?? 3),
    lastError: item.lastError ? String(item.lastError) : undefined,
    payload: (item.payload && typeof item.payload === "object" ? item.payload : {}) as Record<
      string,
      unknown
    >,
    createdAt: requiredIso(item.createdAt),
    updatedAt: requiredIso(item.updatedAt),
  };
}

async function audit(action: string, customerId?: unknown, payload?: Record<string, unknown>) {
  await AuditLogModel.create({
    action,
    customerId: customerId ? objectId(idOf(customerId), "customerId") : null,
    payload: payload ?? null,
  });
}

async function createAutomationJob(input: {
  type: AutomationJobType;
  customerId?: string;
  elderProfileId?: string;
  scheduledAt?: string | Date;
  payload?: Record<string, unknown>;
  maxAttempts?: number;
}) {
  const job = await AutomationJobModel.create({
    type: input.type,
    status: "queued",
    customerId: input.customerId ? objectId(input.customerId, "customerId") : null,
    elderProfileId: input.elderProfileId ? objectId(input.elderProfileId, "elderProfileId") : null,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : new Date(),
    attemptCount: 0,
    maxAttempts: input.maxAttempts ?? 3,
    payload: input.payload ?? {},
  });
  await audit(`automation.${input.type}.queued`, input.customerId, input.payload);
  return job;
}

async function updateSetupStatus(customerId: unknown) {
  const customerObjectId = objectId(idOf(customerId), "customerId");
  const [hasLine, hasBotnoi] = await Promise.all([
    LineConnectionModel.exists({ customerId: customerObjectId, status: "linked" }),
    BotnoiMappingModel.exists({ customerId: customerObjectId, status: "active" }),
  ]);
  const setupStatus = hasLine && hasBotnoi ? "ready" : hasLine ? "waiting_botnoi" : "waiting_line";
  await CustomerModel.findByIdAndUpdate(customerObjectId, { setupStatus });
  return setupStatus;
}

function verifyLineSignature(req: RawBodyRequest) {
  const channelSecret = readConfiguredEnv("LINE_CHANNEL_SECRET");
  if (!channelSecret) {
    throw new ApiError(503, "LINE_SECRET_MISSING", "LINE_CHANNEL_SECRET is not configured.");
  }
  const rawBody = req.rawBody;
  const signature = String(req.headers["x-line-signature"] ?? "");
  if (!rawBody || !signature) {
    throw new ApiError(401, "LINE_SIGNATURE_MISSING", "Missing LINE webhook signature.");
  }
  const expectedSignature = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  const matches = expected.length === received.length && crypto.timingSafeEqual(expected, received);
  if (!matches) {
    throw new ApiError(401, "LINE_SIGNATURE_INVALID", "Invalid LINE webhook signature.");
  }
}

function verifyBotnoiSecret(req: Request) {
  const secret = readConfiguredEnv("BOTNOI_WEBHOOK_SECRET");
  if (!secret) return;
  const received = String(
    req.headers["x-botnoi-webhook-secret"] ?? req.headers["x-voicemed-webhook-secret"] ?? "",
  );
  if (!received || received !== secret) {
    throw new ApiError(401, "BOTNOI_SECRET_INVALID", "Invalid Botnoi webhook secret.");
  }
}

async function runDueAutomationJobs() {
  const jobs = await AutomationJobModel.find({
    status: { $in: ["queued", "retrying"] },
    scheduledAt: { $lte: new Date() },
  }).sort({ scheduledAt: 1 });
  const results = [];
  for (const job of jobs) {
    results.push(await runAutomationJob(idOf(doc(job)._id)));
  }
  return { total: results.length, results };
}

async function runAutomationJob(jobId: string) {
  const job = await AutomationJobModel.findByIdAndUpdate(
    jobId,
    { status: "running", startedAt: new Date(), $inc: { attemptCount: 1 }, updatedAt: new Date() },
    { new: true },
  );
  if (!job) return { jobId, status: "missing" };

  const jobDoc = doc(job);
  const type = String(jobDoc.type) as AutomationJobType;
  const payload = (
    jobDoc.payload && typeof jobDoc.payload === "object" ? jobDoc.payload : {}
  ) as Record<string, unknown>;

  if (type === "line_link_expire_check") {
    const lineConnectionId = String(payload.lineConnectionId ?? "");
    const link = lineConnectionId ? await LineConnectionModel.findById(lineConnectionId) : null;
    if (link) {
      const linkDoc = doc(link);
      if (
        String(linkDoc.status) === "pending" &&
        new Date(linkDoc.expiresAt as Date).getTime() < Date.now()
      ) {
        await LineConnectionModel.findByIdAndUpdate(lineConnectionId, { status: "expired" });
        await audit("line.link_expired", linkDoc.customerId);
      }
    }
    await finishJob(jobId, "success");
    return { jobId, status: "success" };
  }

  if (
    type === "botnoi_contact_sync" ||
    type === "call_schedule_create" ||
    type === "weekly_report_send" ||
    type === "retry_failed_notification" ||
    type === "botnoi_setup_task"
  ) {
    const lastError = "External Botnoi scheduling is not configured yet.";
    await finishJob(jobId, "blocked", lastError);
    return { jobId, status: "blocked", lastError };
  }

  if (type === "line_push_send") {
    return runLinePushJob(
      jobId,
      payload,
      Number(jobDoc.attemptCount ?? 1),
      Number(jobDoc.maxAttempts ?? 3),
    );
  }

  await finishJob(jobId, "success");
  return { jobId, status: "success" };
}

async function runLinePushJob(
  jobId: string,
  payload: Record<string, unknown>,
  attemptCount: number,
  maxAttempts: number,
) {
  const token = readConfiguredEnv("LINE_CHANNEL_ACCESS_TOKEN");
  if (!token) {
    const lastError = "LINE_CHANNEL_ACCESS_TOKEN is not configured yet.";
    await finishJob(jobId, "blocked", lastError);
    return { jobId, status: "blocked", lastError };
  }

  const notificationId = String(payload.notificationId ?? "");
  const notification = notificationId ? await NotificationLogModel.findById(notificationId) : null;
  if (!notification) {
    const lastError = "Notification payload not found.";
    await finishJob(jobId, "failed", lastError);
    return { jobId, status: "failed", lastError };
  }

  const notificationDoc = doc(notification);
  const targets = await LineConnectionModel.find({
    customerId: objectId(idOf(notificationDoc.customerId), "customerId"),
    status: "linked",
    lineUserId: { $ne: null },
  });
  if (targets.length === 0) {
    const lastError = "No linked LINE user found for this customer.";
    await NotificationLogModel.findByIdAndUpdate(notificationId, { deliveryStatus: "failed" });
    await finishJob(jobId, "blocked", lastError);
    return { jobId, status: "blocked", lastError };
  }

  try {
    const sentMessageIds: string[] = [];
    for (const target of targets) {
      const targetDoc = doc(target);
      const response = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetDoc.lineUserId,
          messages: [{ type: "text", text: formatLineNotification(notificationDoc) }],
        }),
      });
      const payloadJson = (await response.json().catch(() => ({}))) as {
        sentMessages?: Array<{ id?: string }>;
        messageId?: string;
      };
      if (!response.ok) {
        throw new Error(
          `LINE push failed with ${response.status}: ${JSON.stringify(payloadJson).slice(0, 240)}`,
        );
      }
      const sentId = payloadJson.sentMessages?.[0]?.id ?? payloadJson.messageId;
      if (sentId) sentMessageIds.push(sentId);
    }
    await NotificationLogModel.findByIdAndUpdate(notificationId, {
      deliveryStatus: "sent",
      sentAt: new Date(),
      lineMessageId: sentMessageIds[0] ?? null,
    });
    await finishJob(jobId, "success");
    return { jobId, status: "success", targetCount: targets.length };
  } catch (error) {
    const lastError = error instanceof Error ? error.message : "LINE push failed";
    if (attemptCount < maxAttempts) {
      await NotificationLogModel.findByIdAndUpdate(notificationId, { deliveryStatus: "retrying" });
      await AutomationJobModel.findByIdAndUpdate(jobId, {
        status: "retrying",
        lastError,
        scheduledAt: new Date(Date.now() + attemptCount * 60 * 1000),
        updatedAt: new Date(),
      });
      return { jobId, status: "retrying", lastError };
    }
    await NotificationLogModel.findByIdAndUpdate(notificationId, { deliveryStatus: "failed" });
    await finishJob(jobId, "failed", lastError);
    return { jobId, status: "failed", lastError };
  }
}

async function finishJob(jobId: string, status: AutomationJobStatus, lastError?: string) {
  await AutomationJobModel.findByIdAndUpdate(jobId, {
    status,
    finishedAt: new Date(),
    updatedAt: new Date(),
    lastError: lastError ?? null,
  });
}

function formatLineNotification(notification: LooseDoc) {
  const audio = notification.audioUrl ? `\n\nAudio: ${notification.audioUrl}` : "";
  return [
    String(notification.title ?? "NongCallJai update"),
    `Elder: ${String(notification.elderName ?? "-")}`,
    `Alert level: ${String(notification.alertLevel ?? "info")}`,
    "",
    String(notification.summary ?? ""),
    "",
    String(notification.safeNote ?? safeNote),
    audio,
  ]
    .filter(Boolean)
    .join("\n");
}

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://nongcalljai.vercel.app",
        "https://nongcalljai.onrender.com",
        readConfiguredEnv("PUBLIC_API_BASE_URL"),
      ].filter(Boolean);
      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      (req as RawBodyRequest).rawBody = Buffer.from(buf);
    },
  }),
);

app.get(
  "/api/health",
  route(
    async () => {
      const before = getMongoStatus();
      let connectionError: string | undefined;
      if (before.configured && !before.connected) {
        try {
          await connectDb();
        } catch (error) {
          connectionError = error instanceof Error ? error.message : "MongoDB connection failed";
        }
      }
      return {
        status: "ok",
        service: "voicemed-api",
        storage: "mongoose",
        mongo: { ...getMongoStatus(), connectionError },
        time: new Date().toISOString(),
      };
    },
    { db: false },
  ),
);

app.get(
  "/api/plans",
  route(() => plans, { db: false }),
);

app.post(
  "/api/checkout/mock-complete",
  route(async (req) => {
    const input = checkoutSchema.parse(req.body);
    const customer = await CustomerModel.create({
      payerName: input.payerName,
      phone: input.phone,
      email: input.email || null,
      planId: input.planId,
      setupStatus: "waiting_line",
    });
    const customerId = idOf(doc(customer)._id);
    const subscription = await SubscriptionModel.create({
      customerId: objectId(customerId, "customerId"),
      planId: input.planId,
      status: "trial",
    });
    await audit("checkout.mock_complete", customerId);
    return {
      customer: serializeCustomer(customer),
      subscription: {
        id: idOf(doc(subscription)._id),
        customerId,
        planId: input.planId,
        status: "trial",
      },
    };
  }),
);

app.post(
  "/api/onboarding/service-request",
  route(async (req) => {
    const input = onboardingSchema.parse(req.body);
    const customer = await CustomerModel.findById(input.customerId);
    if (!customer) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found");
    const customerId = idOf(doc(customer)._id);
    const elder = await ElderProfileModel.create({
      customerId: objectId(customerId, "customerId"),
      name: input.name,
      nickname: input.nickname || null,
      phone: input.phone.trim(),
      relationship: input.relationship,
      relatives: input.relationship,
      note: input.note || null,
      careNote: input.note || null,
      age: input.age ?? null,
      consentGranted: input.consentGranted,
    });
    await CustomerModel.findByIdAndUpdate(customerId, { setupStatus: "waiting_botnoi" });
    await audit("onboarding.service_request", customerId, { elderProfileId: idOf(doc(elder)._id) });
    return {
      customer: serializeCustomer(customer),
      elder: serializeElder(elder),
      setupStatus: "waiting_botnoi",
    };
  }),
);

app.get(
  "/api/customer/setup-status",
  route(async (req) => {
    const customerId = String(req.query.customerId ?? "");
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found");
    const setupStatus = await updateSetupStatus(customerId);
    return { customerId, setupStatus };
  }),
);

app.post(
  "/api/line/link/start",
  route(async (req) => {
    const input = z.object({ customerId: z.string().min(1) }).parse(req.body);
    const customer = await CustomerModel.findById(input.customerId);
    if (!customer) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found");
    const customerId = idOf(doc(customer)._id);
    await LineConnectionModel.updateMany(
      { customerId: objectId(customerId, "customerId"), status: "pending" },
      { status: "expired" },
    );
    const token = crypto.randomBytes(18).toString("base64url");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const link = await LineConnectionModel.create({
      customerId: objectId(customerId, "customerId"),
      token,
      expiresAt,
      status: "pending",
    });
    const linkId = idOf(doc(link)._id);
    await audit("line.link_started", customerId, { lineConnectionId: linkId });
    await createAutomationJob({
      type: "line_link_expire_check",
      customerId,
      scheduledAt: expiresAt,
      payload: { lineConnectionId: linkId },
    });
    return {
      ...serializeLineConnection(link),
      liffUrl: `${getLiffBaseUrl()}?token=${encodeURIComponent(token)}`,
      pollIntervalMs: 2500,
    };
  }),
);

app.get(
  "/api/line/link/status",
  route(async (req) => {
    const input = z.object({ linkId: z.string().min(1) }).parse(req.query);
    const link = await LineConnectionModel.findById(input.linkId);
    if (!link) throw new ApiError(404, "LINE_LINK_NOT_FOUND", "Line link not found");
    const linkDoc = doc(link);
    if (
      String(linkDoc.status) === "pending" &&
      new Date(linkDoc.expiresAt as Date).getTime() < Date.now()
    ) {
      await LineConnectionModel.findByIdAndUpdate(input.linkId, { status: "expired" });
      return { ...serializeLineConnection(link), status: "expired" };
    }
    return serializeLineConnection(link);
  }),
);

app.post(
  "/api/line/link/complete",
  route(async (req) => {
    const input = z
      .object({
        token: z.string().min(1),
        lineUserId: z.string().min(1),
        displayName: z.string().optional(),
        pictureUrl: z.string().url().optional(),
      })
      .parse(req.body);
    const link = await LineConnectionModel.findOne({ token: input.token });
    if (!link) throw new ApiError(404, "LINE_LINK_NOT_FOUND", "Line link not found");
    const linkDoc = doc(link);
    if (linkDoc.usedAt) throw new ApiError(409, "LINE_LINK_USED", "Line link already used");
    if (new Date(linkDoc.expiresAt as Date).getTime() < Date.now()) {
      await LineConnectionModel.findByIdAndUpdate(linkDoc._id, { status: "expired" });
      throw new ApiError(410, "LINE_LINK_EXPIRED", "Line link expired");
    }
    const now = new Date();
    const updated = await LineConnectionModel.findByIdAndUpdate(
      linkDoc._id,
      {
        lineUserId: input.lineUserId,
        displayName: input.displayName || null,
        pictureUrl: input.pictureUrl || null,
        usedAt: now,
        linkedAt: now,
        status: "linked",
      },
      { new: true },
    );
    const setupStatus = await updateSetupStatus(linkDoc.customerId);
    await audit("line.link_completed", linkDoc.customerId, { lineUserId: input.lineUserId });
    await createAutomationJob({
      type: "botnoi_contact_sync",
      customerId: idOf(linkDoc.customerId),
      scheduledAt: now,
      payload: { lineConnectionId: idOf(linkDoc._id), lineUserId: input.lineUserId },
    });
    await createAutomationJob({
      type: "call_schedule_create",
      customerId: idOf(linkDoc.customerId),
      scheduledAt: now,
      payload: { lineConnectionId: idOf(linkDoc._id) },
    });
    return { lineConnection: serializeLineConnection(updated), setupStatus };
  }),
);

app.get(
  "/api/admin/customers",
  route(async () => {
    const customers = await CustomerModel.find({}).sort({ createdAt: -1 });
    return Promise.all(
      customers.map(async (customer) => {
        const customerId = idOf(doc(customer)._id);
        const [elders, lineConnections, botnoiMappings] = await Promise.all([
          ElderProfileModel.find({ customerId: objectId(customerId, "customerId") }).sort({
            createdAt: -1,
          }),
          LineConnectionModel.find({ customerId: objectId(customerId, "customerId") }).sort({
            createdAt: -1,
          }),
          BotnoiMappingModel.find({ customerId: objectId(customerId, "customerId") }).sort({
            updatedAt: -1,
          }),
        ]);
        return {
          ...serializeCustomer(customer),
          elders: elders.map(serializeElder),
          lineConnections: lineConnections.map(serializeLineConnection),
          botnoiMappings: botnoiMappings.map(serializeBotnoiMapping),
        };
      }),
    );
  }),
);

app.get(
  "/api/admin/api-endpoints",
  route(() => apiEndpointCatalog, { db: false }),
);

app.get(
  "/api/admin/automation/jobs",
  route(async (req) => {
    const status = req.query.status
      ? z
          .enum(["queued", "running", "success", "failed", "retrying", "cancelled", "blocked"])
          .parse(req.query.status)
      : undefined;
    const query = status ? { status } : {};
    const jobs = await AutomationJobModel.find(query).sort({ createdAt: -1 });
    return { jobs: jobs.map(serializeJob), total: jobs.length };
  }),
);

app.post(
  "/api/admin/automation/jobs/:id/retry",
  route(async (req) => {
    const job = await AutomationJobModel.findById(req.params.id);
    if (!job) throw new ApiError(404, "AUTOMATION_JOB_NOT_FOUND", "Automation job not found");
    const status = String(doc(job).status);
    if (status === "cancelled" || status === "running") {
      throw new ApiError(409, "AUTOMATION_JOB_NOT_RETRYABLE", "Automation job is not retryable");
    }
    const updated = await AutomationJobModel.findByIdAndUpdate(
      req.params.id,
      { status: "queued", scheduledAt: new Date(), lastError: null, updatedAt: new Date() },
      { new: true },
    );
    await audit(`automation.${String(doc(job).type)}.retry`, doc(job).customerId);
    return { job: serializeJob(updated) };
  }),
);

app.post(
  "/api/admin/automation/jobs/:id/cancel",
  route(async (req) => {
    const job = await AutomationJobModel.findById(req.params.id);
    if (!job) throw new ApiError(404, "AUTOMATION_JOB_NOT_FOUND", "Automation job not found");
    if (String(doc(job).status) === "success") {
      throw new ApiError(409, "AUTOMATION_JOB_COMPLETED", "Automation job is already complete");
    }
    const updated = await AutomationJobModel.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled", finishedAt: new Date(), updatedAt: new Date() },
      { new: true },
    );
    await audit(`automation.${String(doc(job).type)}.cancelled`, doc(job).customerId);
    return { job: serializeJob(updated) };
  }),
);

app.post(
  "/api/admin/automation/run-now",
  route(() => runDueAutomationJobs()),
);

app.get(
  "/api/admin/automation/health",
  route(async () => {
    const [total, queued, blocked, failed] = await Promise.all([
      AutomationJobModel.countDocuments({}),
      AutomationJobModel.countDocuments({ status: "queued" }),
      AutomationJobModel.countDocuments({ status: "blocked" }),
      AutomationJobModel.countDocuments({ status: "failed" }),
    ]);
    return {
      storage: "mongoose",
      queue: { total, queued, blocked, failed },
      integrations: {
        line:
          isConfiguredEnv("LINE_CHANNEL_ACCESS_TOKEN") && isConfiguredEnv("LINE_CHANNEL_SECRET")
            ? "configured"
            : "needs_config",
        botnoi: isConfiguredEnv("BOTNOI_WEBHOOK_SECRET") ? "configured" : "needs_config",
      },
    };
  }),
);

app.patch(
  "/api/admin/customers/:id/botnoi-mapping",
  route(async (req) => {
    const input = z
      .object({
        elderProfileId: z.string().optional(),
        botnoiBotId: z.string().min(1),
        botnoiContactId: z.string().min(1),
      })
      .parse(req.body);
    const customerId = String(req.params.id);
    const customer = await CustomerModel.findById(customerId);
    if (!customer) throw new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found");
    const existing = await BotnoiMappingModel.findOne({
      customerId: objectId(customerId, "customerId"),
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
    });
    const values = {
      customerId: objectId(customerId, "customerId"),
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
      elderProfileId: input.elderProfileId
        ? objectId(input.elderProfileId, "elderProfileId")
        : null,
      status: "active" as const,
    };
    const mapping = existing
      ? await BotnoiMappingModel.findByIdAndUpdate(doc(existing)._id, values, { new: true })
      : await BotnoiMappingModel.create(values);
    const setupStatus = await updateSetupStatus(customerId);
    await audit("admin.botnoi_mapping_upsert", customerId, {
      botnoiContactId: input.botnoiContactId,
    });
    return { mapping: serializeBotnoiMapping(mapping), setupStatus };
  }),
);

app.get(
  "/api/botnoi/elder/:phone",
  route(async (req) => {
    verifyBotnoiSecret(req);
    const elder = await ElderProfileModel.findOne({ phone: req.params.phone });
    if (!elder) throw new ApiError(404, "ELDER_NOT_FOUND", "Elder not found");
    const elderDoc = doc(elder);
    return {
      elder_phone: String(elderDoc.phone ?? ""),
      Relatives: String(elderDoc.relatives ?? elderDoc.relationship ?? ""),
      Relative_name: String(elderDoc.Relative_name ?? elderDoc.nickname ?? ""),
      elder_name: String(elderDoc.name ?? ""),
      Customer_name: String(elderDoc.Customer_name ?? ""),
      ai_name: "NongCallJai",
      note: String(elderDoc.careNote ?? elderDoc.note ?? ""),
    };
  }),
);

app.get(
  "/api/botnoi/next-call",
  route(async (req) => {
    verifyBotnoiSecret(req);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const calledTodayLogs = await CallFeedbackLogModel.find({
      startedAt: { $gte: todayStart },
    }).select("botnoiContactId");
    const calledContactIds = calledTodayLogs.map((log) => String(doc(log).botnoiContactId));
    const mapping = await BotnoiMappingModel.findOne({
      status: "active",
      botnoiContactId: { $nin: calledContactIds },
    }).sort({ createdAt: 1 });
    if (!mapping) throw new ApiError(404, "NO_PENDING_CALLS", "No pending calls for today");
    const mappingDoc = doc(mapping);
    const elder = mappingDoc.elderProfileId
      ? await ElderProfileModel.findById(mappingDoc.elderProfileId)
      : null;
    if (!elder) throw new ApiError(404, "ELDER_NOT_FOUND", "Elder profile not found");
    const elderDoc = doc(elder);
    return {
      elder_phone: String(elderDoc.phone ?? ""),
      Relatives: String(elderDoc.relatives ?? elderDoc.relationship ?? ""),
      Relative_name: String(elderDoc.Relative_name ?? elderDoc.nickname ?? ""),
      elder_name: String(elderDoc.name ?? ""),
      Customer_name: String(elderDoc.Customer_name ?? ""),
      ai_name: "NongCallJai",
      note: String(elderDoc.careNote ?? elderDoc.note ?? ""),
      botnoi_bot_id: String(mappingDoc.botnoiBotId ?? ""),
      botnoi_contact_id: String(mappingDoc.botnoiContactId ?? ""),
    };
  }),
);

app.post(
  "/api/botnoi/call-feedback",
  route(async (req) => {
    verifyBotnoiSecret(req);
    const input = callFeedbackSchema.parse(req.body);
    return handleCallFeedback({
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
      callStatus: input.callStatus,
      startedAt: input.startedAt,
      summary: input.summary,
      transcript: input.transcript,
      audioUrl: input.audioUrl,
      tags: input.tags,
    });
  }),
);

app.get(
  "/api/line/notification-payloads/:id",
  route(async (req) => {
    const notification = await NotificationLogModel.findById(req.params.id);
    if (!notification) throw new ApiError(404, "NOTIFICATION_NOT_FOUND", "Notification not found");
    return serializeNotification(notification);
  }),
);

app.post(
  "/api/line/webhook",
  route(
    async (req) => {
      verifyLineSignature(req as RawBodyRequest);
      const input = lineWebhookSchema.parse(req.body);
      const processed = input.events.map((event) => ({
        type: event.type,
        sourceType: event.source?.type,
        hasUserId: Boolean(event.source?.userId),
      }));
      return { received: input.events.length, processed };
    },
    { db: false },
  ),
);

app.post(
  "/api/line/push-test",
  route(async (req) => {
    const input = linePushTestSchema.parse(req.body);
    const customerId = objectId(input.customerId, "customerId");
    const notification = await NotificationLogModel.create({
      customerId,
      elderName: input.elderName,
      title: input.title,
      summary: input.summary,
      alertLevel: input.alertLevel,
      audioUrl: input.audioUrl ?? null,
      safeNote: input.safeNote,
      deliveryStatus: "pending",
    });
    await createAutomationJob({
      type: "line_push_send",
      customerId: input.customerId,
      scheduledAt: new Date(),
      payload: { notificationId: idOf(doc(notification)._id), alertLevel: input.alertLevel },
    });
    const result = await runDueAutomationJobs();
    return {
      notification: serializeNotification(notification),
      lineSent: result.results.some((item) => item.status === "success"),
      nextStep:
        "Notification payload created and persisted. Check /api/admin/automation/jobs for delivery status.",
    };
  }),
);

app.post(
  "/api/botnoi/webhook",
  route(async (req) => {
    verifyBotnoiSecret(req);
    const body =
      req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};
    const tags =
      body.tags && typeof body.tags === "object" ? (body.tags as Record<string, unknown>) : {};
    const result = await handleCallFeedback({
      botnoiBotId: String(body.bot_id ?? body.botnoiBotId ?? ""),
      botnoiContactId: String(body.contact_id ?? body.botnoiContactId ?? ""),
      callStatus: String(body.status ?? body.callStatus ?? "answered"),
      startedAt: String(body.started_at ?? body.startedAt ?? new Date().toISOString()),
      summary: body.summary ? String(body.summary) : undefined,
      transcript: body.transcript ? String(body.transcript) : undefined,
      audioUrl: body.audio_url ? String(body.audio_url) : undefined,
      tags,
    });
    return result;
  }),
);

async function handleCallFeedback(input: {
  botnoiBotId: string;
  botnoiContactId: string;
  callStatus: string;
  startedAt: string;
  summary?: string;
  transcript?: string;
  audioUrl?: string;
  tags?: Record<string, unknown>;
}) {
  const mapping = await BotnoiMappingModel.findOne({
    botnoiBotId: input.botnoiBotId,
    botnoiContactId: input.botnoiContactId,
  });
  if (!mapping) throw new ApiError(404, "BOTNOI_MAPPING_NOT_FOUND", "Botnoi mapping not found");
  const mappingDoc = doc(mapping);
  const mappingCustomerId = objectId(idOf(mappingDoc.customerId), "customerId");
  const mappingElderProfileId = maybeId(mappingDoc.elderProfileId)
    ? objectId(idOf(mappingDoc.elderProfileId), "elderProfileId")
    : null;
  const elderProfile = mappingElderProfileId
    ? await ElderProfileModel.findById(mappingElderProfileId)
    : null;
  const elderDoc = doc(elderProfile);
  const elderName = String(elderDoc.nickname ?? elderDoc.name ?? "Elder");
  const alertLevel: AlertLevel =
    input.callStatus !== "answered" ? "watch" : input.tags?.symptom ? "urgent" : "info";
  const log = await CallFeedbackLogModel.create({
    customerId: mappingCustomerId,
    elderProfileId: mappingElderProfileId,
    botnoiBotId: input.botnoiBotId,
    botnoiContactId: input.botnoiContactId,
    callStatus: input.callStatus,
    startedAt: new Date(input.startedAt),
    summary: input.summary ?? null,
    transcript: input.transcript ?? null,
    audioUrl: input.audioUrl ?? null,
    tags: input.tags ?? null,
    meal: typeof input.tags?.meal === "boolean" ? input.tags.meal : null,
    meal_detail: input.tags?.meal_detail ? String(input.tags.meal_detail) : null,
    medication_status:
      typeof input.tags?.medication_status === "boolean" ? input.tags.medication_status : null,
    medication_detail: input.tags?.medication_detail ? String(input.tags.medication_detail) : null,
    today_activity: input.tags?.today_activity ? String(input.tags.today_activity) : null,
    caring_message: input.tags?.caring_message ? String(input.tags.caring_message) : null,
  });
  const notification = await NotificationLogModel.create({
    customerId: mappingCustomerId,
    elderName,
    title:
      input.callStatus === "answered"
        ? "NongCallJai call completed"
        : "NongCallJai has a call to review",
    summary:
      input.summary ??
      (input.callStatus === "answered"
        ? "A new Botnoi voicebot call result is ready for family review."
        : "A call was missed or failed and should be checked by the family."),
    alertLevel,
    audioUrl: input.audioUrl ?? null,
    safeNote,
    deliveryStatus: "pending",
  });
  await createAutomationJob({
    type: "call_feedback_process",
    customerId: idOf(mappingCustomerId),
    elderProfileId: maybeId(mappingElderProfileId),
    scheduledAt: new Date(),
    payload: {
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
      callStatus: input.callStatus,
    },
  });
  await createAutomationJob({
    type: "summary_generate",
    customerId: idOf(mappingCustomerId),
    elderProfileId: maybeId(mappingElderProfileId),
    scheduledAt: new Date(),
    payload: { notificationId: idOf(doc(notification)._id), alertLevel },
  });
  await createAutomationJob({
    type: "line_push_send",
    customerId: idOf(mappingCustomerId),
    elderProfileId: maybeId(mappingElderProfileId),
    scheduledAt: new Date(),
    payload: { notificationId: idOf(doc(notification)._id), alertLevel },
  });
  return {
    log: { id: idOf(doc(log)._id), callStatus: input.callStatus, startedAt: input.startedAt },
    notification: serializeNotification(notification),
    alertLevel,
  };
}

app.use((_req: Request, res: Response) => {
  res.status(404).json(fail("NOT_FOUND", "API route not found"));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  sendError(res, error);
});

export default app;
