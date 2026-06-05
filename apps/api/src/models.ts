import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const modelOptions = {
  timestamps: true,
  versionKey: false,
} as const;

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
  modelOptions,
);

const SubscriptionSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    planId: { type: String, required: true },
    status: { type: String, default: "trial" },
  },
  modelOptions,
);

const ElderProfileSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    familyAccountId: { type: Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    nickname: { type: String, default: null },
    phone: { type: String, required: true, index: true },
    relationship: { type: String, default: null },
    note: { type: String, default: null },
    consentGranted: { type: Boolean, default: false },
    age: { type: Number, default: null },
    Relative_name: { type: String, default: null },
    relatives: { type: String, default: null },
    Customer_name: { type: String, default: null },
    regCode: { type: String, default: null },
    careNote: { type: String, default: null },
  },
  { ...modelOptions, strict: false },
);

const LineConnectionSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    token: { type: String, unique: true, required: true },
    lineUserId: { type: String, default: null },
    displayName: { type: String, default: null },
    pictureUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "linked", "expired", "used", "failed"],
      default: "pending",
      index: true,
    },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    linkedAt: { type: Date, default: null },
  },
  modelOptions,
);

const BotnoiMappingSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    botnoiBotId: { type: String, required: true },
    botnoiContactId: { type: String, required: true, index: true },
    elderProfileId: { type: Schema.Types.ObjectId, ref: "ElderProfile", default: null },
    status: { type: String, enum: ["draft", "active", "inactive"], default: "active" },
  },
  modelOptions,
);

const CallFeedbackLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    elderProfileId: { type: Schema.Types.ObjectId, ref: "ElderProfile", default: null },
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
  modelOptions,
);

const NotificationLogSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    elderName: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    alertLevel: { type: String, enum: ["info", "watch", "urgent"], default: "info" },
    audioUrl: { type: String, default: null },
    safeNote: { type: String, required: true },
    deliveryStatus: {
      type: String,
      enum: ["pending", "retrying", "sent", "failed", "acknowledged"],
      default: "pending",
      index: true,
    },
    lineMessageId: { type: String, default: null },
    sentAt: { type: Date, default: null },
  },
  modelOptions,
);

const AutomationJobSchema = new Schema(
  {
    type: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["queued", "running", "success", "failed", "retrying", "cancelled", "blocked"],
      default: "queued",
      index: true,
    },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    elderProfileId: { type: Schema.Types.ObjectId, ref: "ElderProfile", default: null },
    scheduledAt: { type: Date, required: true, index: true },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastError: { type: String, default: null },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  modelOptions,
);

const AuditLogSchema = new Schema(
  {
    action: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    payload: { type: Schema.Types.Mixed, default: null },
  },
  modelOptions,
);

type Customer = InferSchemaType<typeof CustomerSchema>;
type Subscription = InferSchemaType<typeof SubscriptionSchema>;
type ElderProfile = InferSchemaType<typeof ElderProfileSchema>;
type LineConnection = InferSchemaType<typeof LineConnectionSchema>;
type BotnoiMapping = InferSchemaType<typeof BotnoiMappingSchema>;
type CallFeedbackLog = InferSchemaType<typeof CallFeedbackLogSchema>;
type NotificationLog = InferSchemaType<typeof NotificationLogSchema>;
type AutomationJob = InferSchemaType<typeof AutomationJobSchema>;
type AuditLog = InferSchemaType<typeof AuditLogSchema>;

function getModel<T>(name: string, schema: Schema<T>) {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}

export const CustomerModel = getModel<Customer>("Customer", CustomerSchema);
export const SubscriptionModel = getModel<Subscription>("Subscription", SubscriptionSchema);
export const ElderProfileModel = getModel<ElderProfile>("ElderProfile", ElderProfileSchema);
export const LineConnectionModel = getModel<LineConnection>("LineConnection", LineConnectionSchema);
export const BotnoiMappingModel = getModel<BotnoiMapping>("BotnoiMapping", BotnoiMappingSchema);
export const CallFeedbackLogModel = getModel<CallFeedbackLog>(
  "CallFeedbackLog",
  CallFeedbackLogSchema,
);
export const NotificationLogModel = getModel<NotificationLog>(
  "NotificationLog",
  NotificationLogSchema,
);
export const AutomationJobModel = getModel<AutomationJob>("AutomationJob", AutomationJobSchema);
export const AuditLogModel = getModel<AuditLog>("AuditLog", AuditLogSchema);
