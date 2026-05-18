import express from "express";
import { z } from "zod";
import {
  db,
  completeLineLink,
  createCustomer,
  createElder,
  createLineLink,
  createNotification,
  updateSetupStatus,
  upsertBotnoiMapping,
} from "./store.js";
import type { AlertLevel, ApiResponse } from "./contracts.js";

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(express.json({ limit: "1mb" }));

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

app.get("/api/health", (_req, res) => {
  res.json(
    ok({
      status: "ok",
      service: "voicemed-api",
      storage: "memory",
      time: new Date().toISOString(),
    }),
  );
});

app.get("/api/plans", (_req, res) => {
  res.json(ok(plans));
});

app.post(
  "/api/checkout/mock-complete",
  route((req) => {
    const input = checkoutSchema.parse(req.body);
    const customer = createCustomer({ ...input, email: input.email || undefined });
    return {
      customer,
      subscription: { customerId: customer.id, planId: input.planId, status: "trial" },
    };
  }),
);

app.post(
  "/api/onboarding/service-request",
  route((req) => {
    const input = onboardingSchema.parse(req.body);
    const customer = db.customers.find((item) => item.id === input.customerId);
    if (!customer) throw new Error("Customer not found");
    const elder = createElder(input);
    return { customer, elder, setupStatus: updateSetupStatus(customer.id) };
  }),
);

app.get(
  "/api/customer/setup-status",
  route((req) => {
    const customerId = String(req.query.customerId ?? "");
    const customer = db.customers.find((item) => item.id === customerId);
    if (!customer) throw new Error("Customer not found");
    return { customerId, setupStatus: updateSetupStatus(customerId) };
  }),
);

app.post(
  "/api/line/link/start",
  route((req) => {
    const input = z.object({ customerId: z.string().min(1) }).parse(req.body);
    const customer = db.customers.find((item) => item.id === input.customerId);
    if (!customer) throw new Error("Customer not found");
    const link = createLineLink(customer.id);
    const liffBaseUrl = process.env.LIFF_BASE_URL ?? "https://liff.line.me/VOICE_MED_LIFF_ID";
    return { ...link, liffUrl: `${liffBaseUrl}?token=${encodeURIComponent(link.token)}` };
  }),
);

app.post(
  "/api/line/link/complete",
  route((req) => {
    const input = z
      .object({
        token: z.string().min(1),
        lineUserId: z.string().min(1),
        displayName: z.string().optional(),
      })
      .parse(req.body);
    const result = completeLineLink(input);
    if ("error" in result) throw new Error(`Line link ${result.error}`);
    return { lineConnection: result.link, setupStatus: updateSetupStatus(result.link.customerId) };
  }),
);

app.get("/api/admin/customers", (_req, res) => {
  const rows = db.customers.map((customer) => ({
    ...customer,
    elders: db.elders.filter((elder) => elder.customerId === customer.id),
    lineConnections: db.lineConnections.filter((line) => line.customerId === customer.id),
    botnoiMappings: db.botnoiMappings.filter((mapping) => mapping.customerId === customer.id),
  }));
  res.json(ok(rows, { total: rows.length }));
});

app.patch(
  "/api/admin/customers/:id/botnoi-mapping",
  route((req) => {
    const input = z
      .object({
        elderProfileId: z.string().optional(),
        botnoiBotId: z.string().min(1),
        botnoiContactId: z.string().min(1),
      })
      .parse(req.body);
    const customer = db.customers.find((item) => item.id === req.params.id);
    if (!customer) throw new Error("Customer not found");
    return {
      mapping: upsertBotnoiMapping({ customerId: customer.id, ...input }),
      setupStatus: updateSetupStatus(customer.id),
    };
  }),
);

app.post(
  "/api/botnoi/call-feedback",
  route((req) => {
    const input = z
      .object({
        botnoiBotId: z.string().min(1),
        botnoiContactId: z.string().min(1),
        callStatus: z.enum(["answered", "missed", "failed"]),
        startedAt: z.string().min(1),
        summary: z.string().optional(),
        transcript: z.string().optional(),
        audioUrl: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(req.body);
    const mapping = db.botnoiMappings.find(
      (item) =>
        item.botnoiBotId === input.botnoiBotId && item.botnoiContactId === input.botnoiContactId,
    );
    if (!mapping) throw new Error("Botnoi mapping not found");
    const elder = mapping.elderProfileId
      ? db.elders.find((item) => item.id === mapping.elderProfileId)
      : undefined;
    const alertLevel: AlertLevel =
      input.callStatus !== "answered"
        ? "watch"
        : input.tags?.includes("urgent")
          ? "urgent"
          : input.tags?.includes("needs_review")
            ? "watch"
            : "info";
    const notification = createNotification({
      customerId: mapping.customerId,
      elderName: elder?.nickname || elder?.name || "ผู้สูงอายุ",
      title:
        input.callStatus === "answered" ? "น้องคอลใจโทรสำเร็จแล้ว" : "น้องคอลใจมีสายที่ควรตรวจสอบ",
      summary:
        input.summary ||
        (input.callStatus === "answered"
          ? "มีผลการโทรใหม่จาก Botnoi Voicebot"
          : "การโทรไม่สำเร็จหรือยังไม่ได้รับสาย"),
      alertLevel,
      audioUrl: input.audioUrl,
      safeNote:
        "NongCallJai เป็นบริการถามไถ่และส่งสรุปให้ครอบครัว ไม่วินิจฉัยโรค ไม่สั่งยา และไม่ปรับยา หากอาการรุนแรงควรติดต่อบุคลากรทางการแพทย์หรือช่องทางฉุกเฉินที่เหมาะสม",
    });
    return { notification };
  }),
);

app.get(
  "/api/line/notification-payloads/:id",
  route((req) => {
    const notification = db.notifications.find((item) => item.id === req.params.id);
    if (!notification) throw new Error("Notification not found");
    return notification;
  }),
);

app.listen(port, () => {
  console.log(`VoiceMed API listening on http://localhost:${port}`);
});
