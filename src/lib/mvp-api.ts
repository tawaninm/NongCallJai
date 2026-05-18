import { subscriptionPlans } from "./voicemed-data";

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

export type Customer = {
  id: string;
  payerName: string;
  phone: string;
  email?: string;
  planId: string;
  setupStatus: SetupStatus;
  createdAt: string;
};

export type ElderProfileRequest = {
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

export type LineLink = {
  id: string;
  customerId: string;
  token: string;
  expiresAt: string;
  status: "pending" | "linked" | "expired";
  liffUrl?: string;
};

export type AdminCustomer = Customer & {
  elders: ElderProfileRequest[];
  lineConnections: LineLink[];
  botnoiMappings: Array<{
    id: string;
    botnoiBotId: string;
    botnoiContactId: string;
    status: "draft" | "active";
  }>;
};

const CUSTOMER_KEY = "voicemed_mvp_customer";
const ELDER_KEY = "voicemed_mvp_elder";
const LINE_KEY = "voicemed_mvp_line";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error?.message || `API request failed: ${path}`);
  }
  return payload.data;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    const raw = JSON.stringify(value);
    sessionStorage.setItem(key, raw);
    localStorage.setItem(key, raw);
  } catch {
    // Storage may be unavailable in SSR/preview contexts.
  }
}

export const mvpApi = {
  async getPlans() {
    try {
      return await request<typeof subscriptionPlans>("/api/plans");
    } catch {
      return subscriptionPlans;
    }
  },

  async completeMockCheckout(input: {
    payerName: string;
    phone: string;
    email?: string;
    planId: string;
  }) {
    try {
      const data = await request<{ customer: Customer }>("/api/checkout/mock-complete", {
        method: "POST",
        body: JSON.stringify(input),
      });
      writeJson(CUSTOMER_KEY, data.customer);
      return data.customer;
    } catch {
      const customer: Customer = {
        id: uid("cus"),
        payerName: input.payerName,
        phone: input.phone,
        email: input.email,
        planId: input.planId,
        setupStatus: "waiting_line",
        createdAt: new Date().toISOString(),
      };
      writeJson(CUSTOMER_KEY, customer);
      return customer;
    }
  },

  getStoredCustomer() {
    return readJson<Customer>(CUSTOMER_KEY);
  },

  async submitServiceRequest(input: {
    customerId: string;
    name: string;
    nickname?: string;
    phone: string;
    relationship: string;
    note?: string;
    consentGranted: boolean;
  }) {
    try {
      const data = await request<{ elder: ElderProfileRequest; setupStatus: SetupStatus }>(
        "/api/onboarding/service-request",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
      writeJson(ELDER_KEY, data.elder);
      return data;
    } catch {
      const elder: ElderProfileRequest = {
        id: uid("elder"),
        ...input,
        createdAt: new Date().toISOString(),
      };
      writeJson(ELDER_KEY, elder);
      return { elder, setupStatus: "waiting_line" as SetupStatus };
    }
  },

  async startLineLink(customerId: string) {
    try {
      const data = await request<LineLink>("/api/line/link/start", {
        method: "POST",
        body: JSON.stringify({ customerId }),
      });
      writeJson(LINE_KEY, data);
      return data;
    } catch {
      const token = uid("line");
      const link: LineLink = {
        id: uid("line"),
        customerId,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        status: "pending",
        liffUrl: `https://liff.line.me/VOICE_MED_LIFF_ID?token=${token}`,
      };
      writeJson(LINE_KEY, link);
      return link;
    }
  },

  async getAdminCustomers() {
    try {
      return await request<AdminCustomer[]>("/api/admin/customers");
    } catch {
      const customer = readJson<Customer>(CUSTOMER_KEY);
      if (!customer) return [];
      return [
        {
          ...customer,
          elders: readJson<ElderProfileRequest>(ELDER_KEY)
            ? [readJson<ElderProfileRequest>(ELDER_KEY)!]
            : [],
          lineConnections: readJson<LineLink>(LINE_KEY) ? [readJson<LineLink>(LINE_KEY)!] : [],
          botnoiMappings: [],
        },
      ];
    }
  },
};
