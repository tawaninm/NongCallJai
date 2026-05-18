export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
};

export type SetupStatus = "waiting_line" | "waiting_botnoi" | "ready";
export type AlertLevel = "info" | "watch" | "urgent";
export type LineLinkStatus = "pending" | "linked" | "expired" | "used" | "failed";
export type AutomationJobStatus =
  | "queued"
  | "running"
  | "success"
  | "failed"
  | "retrying"
  | "cancelled"
  | "blocked";

export type AutomationJobType =
  | "line_link_expire_check"
  | "botnoi_contact_sync"
  | "call_schedule_create"
  | "call_feedback_process"
  | "summary_generate"
  | "line_push_send"
  | "weekly_report_send"
  | "retry_failed_notification"
  | "botnoi_setup_task";

export type CustomerRecord = {
  id: string;
  payerName: string;
  phone: string;
  email?: string;
  planId: string;
  setupStatus: SetupStatus;
  createdAt: string;
};

export type ElderProfileRecord = {
  id: string;
  customerId: string;
  name: string;
  nickname?: string;
  phone: string;
  relationship: string;
  note?: string;
  consentGranted: boolean;
  createdAt: string;
};

export type LineConnectionRecord = {
  id: string;
  customerId: string;
  lineUserId?: string;
  displayName?: string;
  pictureUrl?: string;
  token: string;
  expiresAt: string;
  usedAt?: string;
  linkedAt?: string;
  status: LineLinkStatus;
  createdAt: string;
};

export type BotnoiMappingRecord = {
  id: string;
  customerId: string;
  elderProfileId?: string;
  botnoiBotId: string;
  botnoiContactId: string;
  status: "draft" | "active";
  updatedAt: string;
};

export type NotificationPayloadRecord = {
  id: string;
  customerId: string;
  elderName: string;
  title: string;
  summary: string;
  alertLevel: AlertLevel;
  audioUrl?: string;
  safeNote: string;
  createdAt: string;
};

export type AutomationJobRecord = {
  id: string;
  type: AutomationJobType;
  status: AutomationJobStatus;
  customerId?: string;
  elderProfileId?: string;
  scheduledAt: string;
  startedAt?: string;
  finishedAt?: string;
  attemptCount: number;
  maxAttempts: number;
  lastError?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
