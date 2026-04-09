const URLS = {
  auth: "https://functions.poehali.dev/4af79c82-10b3-4a5a-9b91-0b6a70f754a2",
  fulfillment: "https://functions.poehali.dev/65cffefd-e88e-4f9c-a0be-769cb5345a17",
};

function getToken(): string {
  return localStorage.getItem("fh:token") || "";
}

export function setToken(t: string) {
  if (t) localStorage.setItem("fh:token", t);
  else localStorage.removeItem("fh:token");
}

async function request(fn: keyof typeof URLS, action: string, opts?: { method?: string; body?: unknown; params?: Record<string, string> }) {
  const method = opts?.method || "GET";
  const url = new URL(URLS[fn]);
  url.searchParams.set("action", action);
  if (opts?.params) {
    for (const [k, v] of Object.entries(opts.params)) url.searchParams.set(k, v);
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// Auth
export const api = {
  register: (email: string, password: string, phone: string) =>
    request("auth", "register", { method: "POST", body: { email, password, phone } }),

  login: (email: string, password: string) =>
    request("auth", "login", { method: "POST", body: { email, password } }),

  verifyEmail: (code: string) =>
    request("auth", "verify-email", { method: "POST", body: { code } }),

  resendCode: () =>
    request("auth", "resend-code", { method: "POST" }),

  me: () =>
    request("auth", "me"),

  registerFromForm: (body: Record<string, unknown>) =>
    request("auth", "register-from-form", { method: "POST", body }),

  // Fulfillment profile
  getProfile: () =>
    request("fulfillment", "profile"),

  updateProfile: (body: Record<string, unknown>) =>
    request("fulfillment", "update-profile", { method: "POST", body }),

  uploadPhoto: (data: string, contentType: string) =>
    request("fulfillment", "upload-photo", { method: "POST", body: { data, content_type: contentType } }),

  // Public
  listApproved: () =>
    request("fulfillment", "approved"),

  // Quote requests
  sendQuote: (body: Record<string, unknown>) =>
    request("fulfillment", "send-quote", { method: "POST", body }),

  myQuotes: () =>
    request("fulfillment", "my-quotes"),

  updateQuoteStatus: (quoteId: number, status: string) =>
    request("fulfillment", "update-quote-status", { method: "POST", body: { quote_id: quoteId, status } }),

  // Admin / moderation
  adminList: (status?: string) =>
    request("fulfillment", "admin-list", { params: status ? { status } : {} }),

  adminModerate: (fulfillmentId: number, status: string, comment?: string) =>
    request("fulfillment", "admin-moderate", { method: "POST", body: { fulfillment_id: fulfillmentId, status, comment: comment || "" } }),

  adminAllQuotes: () =>
    request("fulfillment", "admin-quotes"),
};

export default api;
