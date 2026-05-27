import crypto from "node:crypto";
import express from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { getLiffBaseUrl, isConfiguredEnv, readConfiguredEnv } from "./config.js";
import {
  db,
  cancelAutomationJob,
  createAutomationJob,
  listAutomationJobs,
  retryAutomationJob,
  runDueAutomationJobs,
} from "./store.js";
import type { AlertLevel, ApiResponse, AutomationJobStatus } from "./contracts.js";

// ============================================================
// Port
// ============================================================

const port = Number(process.env.PORT) || 8787;

// ============================================================
// MongoDB Connection
// ============================================================

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set in .env");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected:", mongoose.connection.host);
}

connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// ============================================================
// Mongoose Schemas & Models
// ============================================================

const { Schema, model, models, Types } = mongoose;

// --- Customer ---
const CustomerSchema = new Schema(
  {
    payerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    planId: { type: String, required: true },
    setupStatus: {
      type: String,
      enum: ["waiting_line", "waiting_botnoi", "ready"],
      default: "waiting_line",
    },
  },
  { timestamps: true },
);
const Customer = models.customers || model("customers", CustomerSchema);

// --- Subscription ---
const SubscriptionSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "customers", required: true },
    planId: { type: String, required: true },
    status: { type: String, default: "trial" },
  },
  { timestamps: true },
);
const Subscription = models.subscriptions || model("subscriptions", SubscriptionSchema);

// --- ElderProfile ---
const ElderProfileSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "customers", required: true },
    name: { type: String, required: true },
    nickname: { type: String, default: null },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
    note: { type: String, default: null },
    consentGranted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const ElderProfile = models.elderprofiles || model("elderprofiles", ElderProfileSchema);

// --- LineConnection ---
const LineConnectionSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "customers", required: true, index: true },
    token: { type: String, unique: true },
    lineUserId: { type: String, default: null },
    displayName: { type: String, default: null },
    pictureUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "linked", "expired"],
      default: "pending",
    },
    expiresAt: { type: Date },
    usedAt: { type: Date, default: null },
    linkedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
const LineConnection = models.lineconnections || model("lineconnections", LineConnectionSchema);

// --- BotnoiMapping ---
const BotnoiMappingSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "customers", required: true, index: true },
    botnoiBotId: { type: String, required: true },
    botnoiContactId: { type: String, required: true, index: true },
    elderProfileId: { type: Schema.Types.ObjectId, ref: "elderprofiles", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);
const BotnoiMapping = models.botnoimappings || model("botnoimappings", BotnoiMappingSchema);

// --- CallFeedbackLog ---
const CallFeedbackLogSchema = new Schema(
  {
    botnoiBotId: { type: String, required: true },
    botnoiContactId: { type: String, required: true, index: true },
    callStatus: { type: String, required: true },
    startedAt: { type: Date, required: true },
    summary: { type: String, default: null },
    transcript: { type: String, default: null },
    audioUrl: { type: String, default: null },
    tags: { type: Schema.Types.Mixed, default: null },
    meal: { type: Boolean, default: null },
    meal_detail: { type: String, default: null },
    medication_status: { type: Boolean, default: null },
    medication_detail: { type: String, default: null },
    today_activity: { type: String, default: null },
    caring_message: { type: String, default: null },
  },
  { timestamps: true },
);
const CallFeedbackLog =
  models.callfeedbacklogs || model("callfeedbacklogs", CallFeedbackLogSchema);

// --- NotificationLog ---
const NotificationLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "customers", required: true },
    elderName: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    alertLevel: { type: String, enum: ["info", "watch", "urgent"], default: "info" },
    audioUrl: { type: String, default: null },
    safeNote: { type: String, required: true },
    deliveryStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true },
);
const NotificationLog =
  models.notificationlogs || model("notificationlogs", NotificationLogSchema);

// ============================================================
// Express Setup
// ============================================================

const app = express();
type RawBodyRequest = express.Request & { rawBody?: Buffer };
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      (req as RawBodyRequest).rawBody = Buffer.from(buf);
    },
  }),
);

function ok<T>(data: T, meta?: ApiResponse<T>["meta"]): ApiResponse<T> {
  return { ok: true, data, meta };
}
function fail(code: string, message: string, details?: unknown): ApiResponse<never> {
  return { ok: false, error: { code, message, details } };
}
function route<T>(handler: (req: express.Request) => T | Promise<T>) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const data = await handler(req);
      res.json(ok(data));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(fail("VALIDATION_ERROR", "Invalid request body", error.flatten()));
        return;
      }
      const message = error instanceof Error ? error.message : "Unexpected API error";
      res.status(500).json(fail("INTERNAL_ERROR", message));
    }
  };
}

// ============================================================
// Static Data
// ============================================================

const plans = [
  { id: "basic", name: "Basic", priceThb: 300, billingCycle: "monthly" },
  { id: "standard", name: "Standard", priceThb: 590, billingCycle: "monthly", highlighted: true },
  { id: "family", name: "Family", priceThb: 990, billingCycle: "monthly" },
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
    description: "Poll the seamless QR linking status.",
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
    description: "ดึงข้อมูลผู้สูงอายุก่อนโทร เช่น ชื่อ, ความสัมพันธ์, ชื่อลูกหลาน",
    sampleBody: null,
  },
  {
    group: "Voicebot/Botnoi",
    method: "POST",
    path: "/api/botnoi/call-feedback",
    auth: "botnoi-webhook-secret",
    description: "Receive call feedback and queue summary/LINE push automation.",
    sampleBody: {
      botnoiBotId: "botnoi-bot-001",
      botnoiContactId: "contact-elder-001",
      callStatus: "answered",
      startedAt: "2026-05-18T09:00:00+07:00",
      summary: "Family-safe summary text",
      tags: { meal: true, meal_detail: "ข้าวต้ม", medication_status: true },
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
      events: [
        {
          type: "follow",
          timestamp: 1779094800000,
          source: { type: "user", userId: "Uxxxxxxxx" },
        },
      ],
    },
  },
  {
    group: "LINE Messaging API",
    method: "POST",
    path: "/api/line/push-test",
    auth: "admin",
    description: "Create a LINE notification payload and queue backend push delivery.",
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
    description: "List queued, blocked, failed, and completed automation jobs.",
  },
  {
    group: "Automation",
    method: "POST",
    path: "/api/admin/automation/run-now",
    auth: "admin",
    description: "Run all due automation jobs immediately in the development queue.",
  },
  {
    group: "Automation",
    method: "GET",
    path: "/api/admin/automation/health",
    auth: "admin",
    description: "Check queue counts and LINE/Botnoi credential configuration status.",
  },
];

// ============================================================
// Zod Schemas
// ============================================================

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
  safeNote: z
    .string()
    .min(1)
    .default(
      "NongCallJai is a family check-in and summary service. It does not diagnose, prescribe, or change medication. If symptoms are severe, contact an appropriate medical professional or emergency channel.",
    ),
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
    .optional(),
});

// ============================================================
// LINE Signature Helper
// ============================================================

function verifyLineSignature(req: RawBodyRequest) {
  const channelSecret = readConfiguredEnv("LINE_CHANNEL_SECRET");
  if (!channelSecret) {
    return {
      ok: false,
      status: 503,
      code: "LINE_SECRET_MISSING",
      message: "LINE_CHANNEL_SECRET is not configured.",
    };
  }
  const rawBody = req.rawBody;
  const signature = String(req.headers["x-line-signature"] ?? "");
  if (!rawBody || !signature) {
    return {
      ok: false,
      status: 401,
      code: "LINE_SIGNATURE_MISSING",
      message: "Missing LINE webhook signature.",
    };
  }
  const expectedSignature = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);
  const matches =
    expected.length === received.length && crypto.timingSafeEqual(expected, received);
  return matches
    ? { ok: true as const }
    : {
        ok: false,
        status: 401,
        code: "LINE_SIGNATURE_INVALID",
        message: "Invalid LINE webhook signature.",
      };
}

// ============================================================
// ROUTES
// ============================================================

// ✅ Health check
app.get("/api/health", (_req, res) => {
  res.json(
    ok({
      status: "ok",
      service: "voicemed-api",
      storage: "mongoose",
      automationJobs: db.automationJobs.length,
      time: new Date().toISOString(),
    }),
  );
});

// ✅ Plans
app.get("/api/plans", (_req, res) => {
  res.json(ok(plans));
});

// ✅ Mongoose — Mock checkout
app.post(
  "/api/checkout/mock-complete",
  route(async (req) => {
    const input = checkoutSchema.parse(req.body);
    const customer = await Customer.create({
      payerName: input.payerName,
      phone: input.phone,
      email: input.email || null,
      planId: input.planId,
      setupStatus: "waiting_line",
    });
    const subscription = await Subscription.create({
      customerId: customer._id,
      planId: input.planId,
      status: "trial",
    });
    return { customer, subscription };
  }),
);

// ✅ Mongoose — Service onboarding
app.post(
  "/api/onboarding/service-request",
  route(async (req) => {
    const input = onboardingSchema.parse(req.body);
    const customer = await Customer.findById(input.customerId);
    if (!customer) throw new Error("Customer not found");
    const elder = await ElderProfile.create({
      customerId: customer._id,
      name: input.name,
      nickname: input.nickname || null,
      phone: input.phone,
      relationship: input.relationship,
      note: input.note || null,
      consentGranted: input.consentGranted,
    });
    await Customer.findByIdAndUpdate(input.customerId, { setupStatus: "waiting_botnoi" });
    return { customer, elder, setupStatus: "waiting_botnoi" };
  }),
);

// ✅ Mongoose — Setup status
app.get(
  "/api/customer/setup-status",
  route(async (req) => {
    const customerId = String(req.query.customerId ?? "");
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Customer not found");
    const hasLine = await LineConnection.findOne({ customerId: customer._id, status: "linked" });
    const hasBotnoi = await BotnoiMapping.findOne({ customerId: customer._id, status: "active" });
    const setupStatus =
      hasLine && hasBotnoi ? "ready" : hasLine ? "waiting_botnoi" : "waiting_line";
    await Customer.findByIdAndUpdate(customerId, { setupStatus });
    return { customerId, setupStatus };
  }),
);

// ✅ Mongoose — LINE link start
app.post(
  "/api/line/link/start",
  route(async (req) => {
    const input = z.object({ customerId: z.string().min(1) }).parse(req.body);
    const customer = await Customer.findById(input.customerId);
    if (!customer) throw new Error("Customer not found");

    await LineConnection.updateMany(
      { customerId: customer._id, status: "pending" },
      { status: "expired" },
    );

    const token = crypto.randomBytes(18).toString("base64url");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const link = await LineConnection.create({
      customerId: customer._id,
      token,
      expiresAt,
      status: "pending",
    });
    const liffBaseUrl = getLiffBaseUrl();
    return {
      ...link.toObject(),
      linkId: link._id.toString(),
      liffUrl: `${liffBaseUrl}?token=${encodeURIComponent(link.token)}`,
      pollIntervalMs: 2500,
    };
  }),
);

// ✅ Mongoose — LINE link status
app.get(
  "/api/line/link/status",
  route(async (req) => {
    const input = z.object({ linkId: z.string().min(1) }).parse(req.query);
    const link = await LineConnection.findById(input.linkId);
    if (!link) throw new Error("Line link not_found");
    if (link.status === "pending" && link.expiresAt < new Date()) {
      await LineConnection.findByIdAndUpdate(link._id, { status: "expired" });
      throw new Error("Line link expired");
    }
    return {
      linkId: link._id.toString(),
      customerId: link.customerId.toString(),
      status: link.status,
      expiresAt: link.expiresAt,
      linkedAt: link.linkedAt,
      displayName: link.displayName,
      pictureUrl: link.pictureUrl,
    };
  }),
);

// ✅ Mongoose — LINE link complete
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

    const link = await LineConnection.findOne({ token: input.token });
    if (!link) throw new Error("Line link not_found");
    if (link.usedAt) throw new Error("Line link used");
    if (link.expiresAt < new Date()) {
      await LineConnection.findByIdAndUpdate(link._id, { status: "expired" });
      throw new Error("Line link expired");
    }

    const now = new Date();
    const updated = await LineConnection.findByIdAndUpdate(
      link._id,
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

    const hasBotnoi = await BotnoiMapping.findOne({
      customerId: link.customerId,
      status: "active",
    });
    const setupStatus = hasBotnoi ? "ready" : "waiting_botnoi";
    await Customer.findByIdAndUpdate(link.customerId, { setupStatus });
    return { lineConnection: updated, setupStatus };
  }),
);

// ✅ Mongoose — Admin customers list
app.get(
  "/api/admin/customers",
  route(async () => {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    const result = await Promise.all(
      customers.map(async (c) => {
        const [elders, lineConnections, botnoiMappings] = await Promise.all([
          ElderProfile.find({ customerId: c._id }),
          LineConnection.find({ customerId: c._id }),
          BotnoiMapping.find({ customerId: c._id }),
        ]);
        return { ...c.toObject(), elders, lineConnections, botnoiMappings };
      }),
    );
    return { customers: result, total: result.length };
  }),
);

// ✅ API endpoint catalog
app.get("/api/admin/api-endpoints", (_req, res) => {
  res.json(ok(apiEndpointCatalog, { total: apiEndpointCatalog.length }));
});

// ✅ Automation jobs (in-memory)
app.get(
  "/api/admin/automation/jobs",
  route((req) => {
    const status = req.query.status
      ? z
          .enum(["queued", "running", "success", "failed", "retrying", "cancelled", "blocked"])
          .parse(req.query.status)
      : undefined;
    const jobs = listAutomationJobs(status as AutomationJobStatus | undefined);
    return { jobs, total: jobs.length };
  }),
);

app.post(
  "/api/admin/automation/jobs/:id/retry",
  route((req) => {
    const result = retryAutomationJob(String(req.params.id));
    if ("error" in result) throw new Error(`Automation retry ${result.error}`);
    return result;
  }),
);

app.post(
  "/api/admin/automation/jobs/:id/cancel",
  route((req) => {
    const result = cancelAutomationJob(String(req.params.id));
    if ("error" in result) throw new Error(`Automation cancel ${result.error}`);
    return result;
  }),
);

app.post(
  "/api/admin/automation/run-now",
  route(() => runDueAutomationJobs()),
);

app.get(
  "/api/admin/automation/health",
  route(() => ({
    storage: "mongoose",
    queue: {
      total: db.automationJobs.length,
      queued: db.automationJobs.filter((job) => job.status === "queued").length,
      blocked: db.automationJobs.filter((job) => job.status === "blocked").length,
      failed: db.automationJobs.filter((job) => job.status === "failed").length,
    },
    integrations: {
      line:
        isConfiguredEnv("LINE_CHANNEL_ACCESS_TOKEN") && isConfiguredEnv("LINE_CHANNEL_SECRET")
          ? "configured"
          : "needs_config",
      botnoi: isConfiguredEnv("BOTNOI_WEBHOOK_SECRET") ? "configured" : "needs_config",
    },
  })),
);

// ✅ Mongoose — Admin botnoi mapping
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

    const customer = await Customer.findById(req.params.id);
    if (!customer) throw new Error("Customer not found");

    const existing = await BotnoiMapping.findOne({
      customerId: customer._id,
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
    });

    const mapping = existing
      ? await BotnoiMapping.findByIdAndUpdate(
          existing._id,
          {
            botnoiBotId: input.botnoiBotId,
            elderProfileId: input.elderProfileId || null,
            status: "active",
          },
          { new: true },
        )
      : await BotnoiMapping.create({
          customerId: customer._id,
          botnoiBotId: input.botnoiBotId,
          botnoiContactId: input.botnoiContactId,
          elderProfileId: input.elderProfileId || null,
          status: "active",
        });

    const hasLine = await LineConnection.findOne({ customerId: customer._id, status: "linked" });
    const setupStatus = hasLine ? "ready" : "waiting_line";
    await Customer.findByIdAndUpdate(customer._id, { setupStatus });
    return { mapping, setupStatus };
  }),
);

// ============================================================
// ✅ NEW — Botnoi ดึงข้อมูลผู้สูงอายุก่อนโทร
// ============================================================

app.get(
  "/api/botnoi/elder/:phone",
  route(async (req) => {
    const phone = req.params.phone;

    const elder = await ElderProfile.findOne({ phone });
    if (!elder) throw new Error("Elder not found");

    const customer = await Customer.findById(elder.customerId);
    if (!customer) throw new Error("Customer not found");

    return {
      elder_phone:    elder.phone,
      relationship:   elder.relationship,  // <<Relatives>> เช่น "ยาย", "แม่", "พ่อ"
      elder_name:     elder.name,          // <<Relative_name>> ชื่อเต็มผู้สูงอายุ
      elder_nickname: elder.nickname,      // ชื่อเล่น (ใช้เรียกในบทสนทนาถ้ามี)
      customer_name:  customer.payerName,  // <<Customer_name>> ชื่อลูกหลาน
      ai_name:        "น้องคอลใจ",         // <<AI_name>>
      note:           elder.note,          // โน้ตพิเศษ เช่น ยาที่ต้องกิน
    };
  }),
);

// ✅ Mongoose — Botnoi call-feedback
app.post(
  "/api/botnoi/call-feedback",
  route(async (req) => {
    const input = callFeedbackSchema.parse(req.body);

    const mapping = await BotnoiMapping.findOne({
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
    });

    if (!mapping) throw new Error("Botnoi mapping not found");

    const elderProfile = await ElderProfile.findById(mapping.elderProfileId);
    const elderName = elderProfile?.nickname || elderProfile?.name || "ผู้สูงอายุ";

    const alertLevel: AlertLevel =
      input.callStatus !== "answered" ? "watch" : input.tags?.symptom ? "urgent" : "info";

    const log = await CallFeedbackLog.create({
      botnoiBotId: input.botnoiBotId,
      botnoiContactId: input.botnoiContactId,
      callStatus: input.callStatus,
      startedAt: new Date(input.startedAt),
      summary: input.summary ?? null,
      transcript: input.transcript ?? null,
      audioUrl: input.audioUrl ?? null,
      tags: input.tags ?? null,
      meal: input.tags?.meal ?? null,
      meal_detail: input.tags?.meal_detail ?? null,
      medication_status: input.tags?.medication_status ?? null,
      medication_detail: input.tags?.medication_detail ?? null,
      today_activity: input.tags?.today_activity ?? null,
      caring_message: input.tags?.caring_message ?? null,
    });

    const notification = await NotificationLog.create({
      customerId: mapping.customerId,
      elderName,
      title:
        input.callStatus === "answered"
          ? "น้องคอลใจโทรสำเร็จแล้ว"
          : "น้องคอลใจมีสายที่ควรตรวจสอบ",
      summary:
        input.summary ||
        (input.callStatus === "answered"
          ? "มีผลการโทรใหม่จาก Botnoi Voicebot"
          : "การโทรไม่สำเร็จหรือยังไม่ได้รับสาย"),
      alertLevel,
      audioUrl: input.audioUrl ?? null,
      safeNote:
        "NongCallJai เป็นบริการถามไถ่และส่งสรุปให้ครอบครัว ไม่วินิจฉัยโรค ไม่สั่งยา และไม่ปรับยา",
      deliveryStatus: "pending",
    });

    createAutomationJob({
      type: "call_feedback_process",
      customerId: mapping.customerId.toString(),
      elderProfileId: mapping.elderProfileId?.toString() ?? undefined,
      scheduledAt: new Date().toISOString(),
      payload: {
        botnoiBotId: input.botnoiBotId,
        botnoiContactId: input.botnoiContactId,
        callStatus: input.callStatus,
      },
    });
    createAutomationJob({
      type: "summary_generate",
      customerId: mapping.customerId.toString(),
      elderProfileId: mapping.elderProfileId?.toString() ?? undefined,
      scheduledAt: new Date().toISOString(),
      payload: { notificationId: notification._id.toString(), alertLevel },
    });

    return { log, notification, alertLevel };
  }),
);

// ✅ Mongoose — Notification payload
app.get(
  "/api/line/notification-payloads/:id",
  route(async (req) => {
    const notification = await NotificationLog.findById(req.params.id);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }),
);

// ✅ LINE Webhook (signature verify)
app.post("/api/line/webhook", (req: RawBodyRequest, res) => {
  const signature = verifyLineSignature(req);
  if (!signature.ok) {
    res.status(signature.status).json(fail(signature.code, signature.message));
    return;
  }
  try {
    const input = lineWebhookSchema.parse(req.body);
    const processed = input.events.map((event) => ({
      type: event.type,
      sourceType: event.source?.type,
      hasUserId: Boolean(event.source?.userId),
    }));
    res.json(ok({ received: input.events.length, processed }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(fail("VALIDATION_ERROR", "Invalid LINE webhook payload", error.flatten()));
      return;
    }
    const message = error instanceof Error ? error.message : "Unexpected LINE webhook error";
    res.status(500).json(fail("INTERNAL_ERROR", message));
  }
});

// ✅ Mongoose — LINE push test
app.post(
  "/api/line/push-test",
  route(async (req) => {
    const input = linePushTestSchema.parse(req.body);

    const notification = await NotificationLog.create({
      customerId: new Types.ObjectId(input.customerId),
      elderName: input.elderName,
      title: input.title,
      summary: input.summary,
      alertLevel: input.alertLevel,
      audioUrl: input.audioUrl ?? null,
      safeNote: input.safeNote,
      deliveryStatus: "pending",
    });

    let lineSent = false;
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (accessToken && !accessToken.includes("...")) {
      const lineConnection = await LineConnection.findOne({
        customerId: new Types.ObjectId(input.customerId),
        status: "linked",
      });
      if (lineConnection?.lineUserId) {
        const text = `🔔 ${input.title}\n\n${input.summary}\n\n⚠️ ${input.safeNote}`;
        await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            to: lineConnection.lineUserId,
            messages: [{ type: "text", text }],
          }),
        });
        await NotificationLog.findByIdAndUpdate(notification._id, {
          deliveryStatus: "sent",
          sentAt: new Date(),
        });
        lineSent = true;
      }
    }

    return {
      notification,
      lineSent,
      nextStep: lineSent
        ? "LINE message sent successfully"
        : "No linked LINE account found. Call POST /api/admin/automation/run-now or wait for the worker scheduler.",
    };
  }),
);

// ✅ Mongoose — Botnoi Webhook (format ตรงจาก Botnoi)
app.post("/api/botnoi/webhook", async (req, res) => {
  try {
    const body = req.body;

    const log = await CallFeedbackLog.create({
      botnoiBotId: body.bot_id ?? "",
      botnoiContactId: body.contact_id ?? "",
      callStatus: body.status ?? "completed",
      startedAt: body.started_at ? new Date(body.started_at) : new Date(),
      summary: body.summary ?? null,
      transcript: body.transcript ?? null,
      audioUrl: body.audio_url ?? null,
      tags: body.tags ?? null,
      meal: body.tags?.meal ?? null,
      meal_detail: body.tags?.meal_detail ?? null,
      medication_status: body.tags?.medication_status ?? null,
      medication_detail: body.tags?.meal_detail ?? null,
      today_activity: body.tags?.today_activity ?? null,
      caring_message: body.tags?.caring_message ?? null,
    });

    const mapping = await BotnoiMapping.findOne({
      botnoiBotId: body.bot_id ?? "",
      botnoiContactId: body.contact_id ?? "",
    });

    let lineSent = false;
    if (mapping) {
      const [lineConnection, elderProfile] = await Promise.all([
        LineConnection.findOne({ customerId: mapping.customerId, status: "linked" }),
        ElderProfile.findById(mapping.elderProfileId),
      ]);

      if (lineConnection?.lineUserId) {
        const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        if (accessToken && !accessToken.includes("...")) {
          const elderName = elderProfile?.nickname || elderProfile?.name || "ผู้สูงอายุ";
          const meal = body.tags?.meal
            ? `✅ กินข้าวแล้ว: ${body.tags?.meal_detail || "-"}`
            : "❌ ยังไม่ได้กินข้าว";
          const med = body.tags?.medication_status ? "✅ กินยาแล้ว" : "❌ ยังไม่ได้กินยา";
          const act = body.tags?.today_activity ? `📝 ${body.tags.today_activity}` : "-";
          const msg = body.tags?.caring_message ? `\n💌 ${body.tags.caring_message}` : "";
          const text = `🔔 น้องคอลใจรายงานสุขภาพ ${elderName}\n\n${meal}\n${med}\n🏃 กิจวัตร: ${act}${msg}\n\n⚠️ NongCallJai เป็นบริการถามไถ่ ไม่วินิจฉัยโรค`;

          await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              to: lineConnection.lineUserId,
              messages: [{ type: "text", text }],
            }),
          });
          lineSent = true;
        }
      }
    }

    res.json({ ok: true, data: log, lineSent });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ============================================================
// Start Server
// ============================================================

app.listen(port, () => {
  console.log(`✅ NongCallJai API listening on port ${port}`);
});