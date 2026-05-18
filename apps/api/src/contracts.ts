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
  token: string;
  expiresAt: string;
  usedAt?: string;
  status: "pending" | "linked" | "expired";
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
