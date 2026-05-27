import crypto from "node:crypto";
import express from "express";
import { z } from "zod";
import { getLiffBaseUrl, isConfiguredEnv, port, readConfiguredEnv } from "./config.js";
import {
  db,
  cancelAutomationJob,
  createAutomationJob,
  listAutomationJobs,
  retryAutomationJob,
  runDueAutomationJobs,
} from "./store.js";
import type { AlertLevel, ApiResponse, AutomationJobStatus } from "./contracts.js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

// --- Zod Schemas ---

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

// --- LINE signature helper ---

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
      storage: "prisma",
      automationJobs: db.automationJobs.length,
      time: new Date().toISOString(),
    }),
  );
});

// ✅ Plans
app.get("/api/plans", (_req, res) => {
  res.json(ok(plans));
});

// ✅ Prisma — Mock checkout
app.post(
  "/api/checkout/mock-complete",
  route(async (req) => {
    const input = checkoutSchema.parse(req.body);
    const customer = await prisma.customer.create({
      data: {
        payerName: input.payerName,
        phone: input.phone,
        email: input.email || null,
        planId: input.planId,
        setupStatus: "waiting_line",
      },
    });
    const subscription = await prisma.subscription.create({
      data: {
        customerId: customer.id,
        planId: input.planId,
        status: "trial",
      },
    });
    return { customer, subscription };
  }),
);

// ✅ Prisma — Service onboarding
app.post(
  "/api/onboarding/service-request",
  route(async (req) => {
    const input = onboardingSchema.parse(req.body);
    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw new Error("Customer not found");
    const elder = await prisma.elderProfile.create({
      data: {
        customerId: input.customerId,
        name: input.name,
        nickname: input.nickname || null,
        phone: input.phone,
        relationship: input.relationship,
        note: input.note || null,
        consentGranted: input.consentGranted,
      },
    });
    await prisma.customer.update({
      where: { id: input.customerId },
      data: { setupStatus: "waiting_botnoi" },
    });
    return { customer, elder, setupStatus: "waiting_botnoi" };
  }),
);

// ✅ Prisma — Setup status
app.get(
  "/api/customer/setup-status",
  route(async (req) => {
    const customerId = String(req.query.customerId ?? "");
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Customer not found");
    const hasLine = await prisma.lineConnection.findFirst({
      where: { customerId, status: "linked" },
    });
    const hasBotnoi = await prisma.botnoiMapping.findFirst({
      where: { customerId, status: "active" },
    });
    const setupStatus =
      hasLine && hasBotnoi ? "ready" : hasLine ? "waiting_botnoi" : "waiting_line";
    await prisma.customer.update({ where: { id: customerId }, data: { setupStatus } });
    return { customerId, setupStatus };
  }),
);

// ✅ Prisma — LINE link start
app.post(
  "/api/line/link/start",
  route(async (req) => {
    const input = z.object({ customerId: z.string().min(1) }).parse(req.body);
    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw new Error("Customer not found");
    await prisma.lineConnection.updateMany({
      where: { customerId: input.customerId, status: "pending" },
      data: { status: "expired" },
    });
    const token = crypto.randomBytes(18).toString("base64url");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const link = await prisma.lineConnection.create({
      data: { customerId: input.customerId, token, expiresAt, status: "pending" },
    });
    const liffBaseUrl = getLiffBaseUrl();
    return {
      ...link,
      linkId: link.id,
      liffUrl: `${liffBaseUrl}?token=${encodeURIComponent(link.token)}`,
      pollIntervalMs: 2500,
    };
  }),
);

// ✅ Prisma — LINE link status
app.get(
  "/api/line/link/status",
  route(async (req) => {
    const input = z.object({ linkId: z.string().min(1) }).parse(req.query);
    const link = await prisma.lineConnection.findUnique({ where: { id: input.linkId } });
    if (!link) throw new Error("Line link not_found");
    if (link.status === "pending" && link.expiresAt < new Date()) {
      await prisma.lineConnection.update({ where: { id: link.id }, data: { status: "expired" } });
      throw new Error("Line link expired");
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
  }),
);

// ✅ Prisma — LINE link complete
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
    const link = await prisma.lineConnection.findUnique({ where: { token: input.token } });
    if (!link) throw new Error("Line link not_found");
    if (link.usedAt) throw new Error("Line link used");
    if (link.expiresAt < new Date()) {
      await prisma.lineConnection.update({ where: { id: link.id }, data: { status: "expired" } });
      throw new Error("Line link expired");
    }
    const now = new Date();
    const updated = await prisma.lineConnection.update({
      where: { id: link.id },
      data: {
        lineUserId: input.lineUserId,
        displayName: input.displayName || null,
        pictureUrl: input.pictureUrl || null,
        usedAt: now,
        linkedAt: now,
        status: "linked",
      },
    });
    const hasBotnoi = await prisma.botnoiMapping.findFirst({
      where: { customerId: link.customerId, status: "active" },
    });
    const setupStatus = hasBotnoi ? "ready" : "waiting_botnoi";
    await prisma.customer.update({ where: { id: link.customerId }, data: { setupStatus } });
    return { lineConnection: updated, setupStatus };
  }),
);

// ✅ Prisma — Admin customers list
app.get(
  "/api/admin/customers",
  route(async () => {
    const customers = await prisma.customer.findMany({
      include: { elders: true, lineConnections: true, botnoiMappings: true },
      orderBy: { createdAt: "desc" },
    });
    return { customers, total: customers.length };
  }),
);

// ✅ API endpoint catalog
app.get("/api/admin/api-endpoints", (_req, res) => {
  res.json(ok(apiEndpointCatalog, { total: apiEndpointCatalog.length }));
});

// ✅ Automation jobs (in-memory queue)
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
    storage: "prisma",
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

// ✅ Prisma — Admin botnoi mapping
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
    const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
    if (!customer) throw new Error("Customer not found");
    const existing = await prisma.botnoiMapping.findFirst({
      where: { customerId: customer.id, botnoiContactId: input.botnoiContactId },
    });
    const mapping = existing
      ? await prisma.botnoiMapping.update({
          where: { id: existing.id },
          data: {
            botnoiBotId: input.botnoiBotId,
            elderProfileId: input.elderProfileId || null,
            status: "active",
          },
        })
      : await prisma.botnoiMapping.create({
          data: {
            customerId: customer.id,
            botnoiBotId: input.botnoiBotId,
            botnoiContactId: input.botnoiContactId,
            elderProfileId: input.elderProfileId || null,
            status: "active",
          },
        });
    const hasLine = await prisma.lineConnection.findFirst({
      where: { customerId: customer.id, status: "linked" },
    });
    const setupStatus = hasLine ? "ready" : "waiting_line";
    await prisma.customer.update({ where: { id: customer.id }, data: { setupStatus } });
    return { mapping, setupStatus };
  }),
);

// ✅ Prisma — Botnoi call-feedback (รับจาก Botnoi → บันทึก DB + สร้าง NotificationLog)
app.post(
  "/api/botnoi/call-feedback",
  route(async (req) => {
    const input = callFeedbackSchema.parse(req.body);

    // หา mapping จาก Prisma
    const mapping = await prisma.botnoiMapping.findFirst({
      where: {
        botnoiBotId: input.botnoiBotId,
        botnoiContactId: input.botnoiContactId,
      },
      include: { elderProfile: true },
    });
    if (!mapping) throw new Error("Botnoi mapping not found");

    const elderName =
      mapping.elderProfile?.nickname || mapping.elderProfile?.name || "ผู้สูงอายุ";

    const alertLevel: AlertLevel =
      input.callStatus !== "answered"
        ? "watch"
        : input.tags?.symptom
          ? "urgent"
          : "info";

    // บันทึก CallFeedbackLog
    const log = await prisma.callFeedbackLog.create({
      data: {
        botnoiBotId:       input.botnoiBotId,
        botnoiContactId:   input.botnoiContactId,
        callStatus:        input.callStatus,
        startedAt:         new Date(input.startedAt),
        summary:           input.summary ?? null,
        transcript:        input.transcript ?? null,
        audioUrl:          input.audioUrl ?? null,
        tags:              input.tags ?? null,
        meal:              input.tags?.meal ?? null,
        meal_detail:       input.tags?.meal_detail ?? null,
        medication_status: input.tags?.medication_status ?? null,
        medication_detail: input.tags?.medication_detail ?? null,
        today_activity:    input.tags?.today_activity ?? null,
        caring_message:    input.tags?.caring_message ?? null,
      },
    });

    // บันทึก NotificationLog
    const notification = await prisma.notificationLog.create({
      data: {
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
        audioUrl:       input.audioUrl ?? null,
        safeNote:
          "NongCallJai เป็นบริการถามไถ่และส่งสรุปให้ครอบครัว ไม่วินิจฉัยโรค ไม่สั่งยา และไม่ปรับยา",
        deliveryStatus: "pending",
      },
    });

    // Queue automation jobs
    createAutomationJob({
      type: "call_feedback_process",
      customerId: mapping.customerId,
      elderProfileId: mapping.elderProfileId ?? undefined,
      scheduledAt: new Date().toISOString(),
      payload: {
        botnoiBotId:     input.botnoiBotId,
        botnoiContactId: input.botnoiContactId,
        callStatus:      input.callStatus,
      },
    });
    createAutomationJob({
      type: "summary_generate",
      customerId: mapping.customerId,
      elderProfileId: mapping.elderProfileId ?? undefined,
      scheduledAt: new Date().toISOString(),
      payload: { notificationId: notification.id, alertLevel },
    });

    return { log, notification, alertLevel };
  }),
);

// ✅ Prisma — Notification payload (ให้ทีม LINE OA ดึงไปส่ง)
app.get(
  "/api/line/notification-payloads/:id",
  route(async (req) => {
    const notification = await prisma.notificationLog.findUnique({
      where: { id: req.params.id },
    });
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

// ✅ Prisma — LINE push test (สร้าง notification + ส่ง LINE จริง)
app.post(
  "/api/line/push-test",
  route(async (req) => {
    const input = linePushTestSchema.parse(req.body);

    // บันทึก NotificationLog ลง DB
    const notification = await prisma.notificationLog.create({
      data: {
        customerId:     input.customerId,
        elderName:      input.elderName,
        title:          input.title,
        summary:        input.summary,
        alertLevel:     input.alertLevel,
        audioUrl:       input.audioUrl ?? null,
        safeNote:       input.safeNote,
        deliveryStatus: "pending",
      },
    });

    // ส่ง LINE push จริง (ถ้ามี token และมี lineUserId)
    let lineSent = false;
    const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (accessToken && !accessToken.includes("...")) {
      const lineConnection = await prisma.lineConnection.findFirst({
        where: { customerId: input.customerId, status: "linked" },
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
        await prisma.notificationLog.update({
          where: { id: notification.id },
          data: { deliveryStatus: "sent", sentAt: new Date() },
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

// ✅ Prisma — Botnoi Webhook (รับจาก Botnoi โดยตรง format ต่างจาก call-feedback)
app.post("/api/botnoi/webhook", async (req, res) => {
  try {
    const body = req.body;

    // บันทึก CallFeedbackLog
    const log = await prisma.callFeedbackLog.create({
      data: {
        botnoiBotId:       body.bot_id ?? "",
        botnoiContactId:   body.contact_id ?? "",
        callStatus:        body.status ?? "completed",
        startedAt:         body.started_at ? new Date(body.started_at) : new Date(),
        summary:           body.summary ?? null,
        transcript:        body.transcript ?? null,
        audioUrl:          body.audio_url ?? null,
        tags:              body.tags ?? null,
        meal:              body.tags?.meal ?? null,
        meal_detail:       body.tags?.meal_detail ?? null,
        medication_status: body.tags?.medication_status ?? null,
        medication_detail: body.tags?.medication_detail ?? null,
        today_activity:    body.tags?.today_activity ?? null,
        caring_message:    body.tags?.caring_message ?? null,
      },
    });

    // หา mapping + ส่ง LINE
    const mapping = await prisma.botnoiMapping.findFirst({
      where: {
        botnoiBotId:     body.bot_id ?? "",
        botnoiContactId: body.contact_id ?? "",
      },
      include: { customer: true, elderProfile: true },
    });

    let lineSent = false;
    if (mapping) {
      const lineConnection = await prisma.lineConnection.findFirst({
        where: { customerId: mapping.customerId, status: "linked" },
      });
      if (lineConnection?.lineUserId) {
        const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        if (accessToken && !accessToken.includes("...")) {
          const elderName =
            mapping.elderProfile?.nickname || mapping.elderProfile?.name || "ผู้สูงอายุ";
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

app.listen(port, () => {
  console.log(`VoiceMed API listening on http://localhost:${port}`);
});