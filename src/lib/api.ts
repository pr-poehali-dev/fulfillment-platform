const URLS = {
  auth: "https://functions.poehali.dev/4af79c82-10b3-4a5a-9b91-0b6a70f754a2",
  fulfillment: "https://functions.poehali.dev/65cffefd-e88e-4f9c-a0be-769cb5345a17",
  getSubscribers: "https://functions.poehali.dev/3187f111-ddb1-43eb-adc8-e0d8a950adba",
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

export const api = {
  // ─── Auth ───────────────────────────────────────────────────────────────
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

  telegramAuth: (data: Record<string, string | number>) =>
    request("auth", "telegram", { method: "POST", body: data }),

  linkEmail: (email: string, password: string) =>
    request("auth", "link-email", { method: "POST", body: { email, password } }),

  changePassword: (current_password: string, new_password: string) =>
    request("auth", "change-password", { method: "POST", body: { current_password, new_password } }),

  sendSupportRequest: (name: string, email: string, message: string) =>
    request("auth", "support", { method: "POST", body: { name, email, message } }),

  forgotPassword: (email: string) =>
    request("auth", "forgot-password", { method: "POST", body: { email } }),

  resetPassword: (email: string, code: string, new_password: string) =>
    request("auth", "reset-password", { method: "POST", body: { email, code, new_password } }),

  // ─── Owner profile ───────────────────────────────────────────────────────
  getOwnerProfile: () =>
    request("fulfillment", "owner-profile"),

  updateOwnerProfile: (body: Record<string, unknown>) =>
    request("fulfillment", "update-owner-profile", { method: "POST", body }),

  // ─── Multi-fulfillment ───────────────────────────────────────────────────
  listMyFulfillments: () =>
    request("fulfillment", "my-fulfillments"),

  getFulfillment: (id: number) =>
    request("fulfillment", "get-fulfillment", { params: { id: String(id) } }),

  createFulfillment: (body: Record<string, unknown>) =>
    request("fulfillment", "create-fulfillment", { method: "POST", body }),

  updateFulfillment: (body: Record<string, unknown>) =>
    request("fulfillment", "update-fulfillment", { method: "POST", body }),

  submitFulfillment: (id: number) =>
    request("fulfillment", "submit-fulfillment", { method: "POST", body: { id } }),

  closeFulfillment: (id: number) =>
    request("fulfillment", "close-fulfillment", { method: "POST", body: { id } }),

  // ─── Legacy (single profile) ─────────────────────────────────────────────
  getProfile: () =>
    request("fulfillment", "profile"),

  updateProfile: (body: Record<string, unknown>) =>
    request("fulfillment", "update-profile", { method: "POST", body }),

  uploadPhoto: (data: string, contentType: string) =>
    request("fulfillment", "upload-photo", { method: "POST", body: { data, content_type: contentType } }),

  submitForModeration: () =>
    request("fulfillment", "submit-for-moderation", { method: "POST" }),

  // ─── Public ─────────────────────────────────────────────────────────────
  listApproved: () =>
    request("fulfillment", "approved"),

  listDemo: (token: string) =>
    request("fulfillment", "demo", { params: { token } }),

  // ─── Quotes ─────────────────────────────────────────────────────────────
  sendQuote: (body: Record<string, unknown>) =>
    request("fulfillment", "send-quote", { method: "POST", body }),

  myQuotes: () =>
    request("fulfillment", "my-quotes"),

  updateQuoteStatus: (quoteId: number, status: string) =>
    request("fulfillment", "update-quote-status", { method: "POST", body: { quote_id: quoteId, status } }),

  viewQuote: (quoteId: number) =>
    request("fulfillment", "view-quote", { method: "POST", body: { quote_id: quoteId } }),

  // ─── Seller cabinet ─────────────────────────────────────────────────────
  sellerQuotes: () =>
    request("fulfillment", "seller-quotes"),

  // ─── Admin ──────────────────────────────────────────────────────────────
  adminList: (status?: string) =>
    request("fulfillment", "admin-list", { params: status ? { status } : {} }),

  adminModerate: (fulfillmentId: number, status: string, comment?: string) =>
    request("fulfillment", "admin-moderate", { method: "POST", body: { fulfillment_id: fulfillmentId, status, comment: comment || "" } }),

  adminAllQuotes: () =>
    request("fulfillment", "admin-quotes"),

  adminSetLeadPrice: (fulfillmentId: number, leadPrice: number) =>
    request("fulfillment", "admin-set-lead-price", { method: "POST", body: { fulfillment_id: fulfillmentId, lead_price: leadPrice } }),

  adminMarkPaid: (quoteId: number) =>
    request("fulfillment", "admin-mark-paid", { method: "POST", body: { quote_id: quoteId } }),

  // ─── Subscribers ────────────────────────────────────────────────────────
  getSubscribers: () =>
    fetch(URLS.getSubscribers, { headers: { "Authorization": `Bearer ${getToken()}` } }).then((r) => r.json()),
};

export default api;