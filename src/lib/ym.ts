declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

const COUNTER_ID = 101026698;

export function ymGoal(goal: string, params?: Record<string, unknown>) {
  const loaded = typeof window.ym === "function";
  if (import.meta.env.DEV) {
    console.log(`[YM] reachGoal → "${goal}"`, params ?? "", loaded ? "✅ ym loaded" : "❌ ym NOT loaded");
  }
  window.ym?.(COUNTER_ID, "reachGoal", goal, params);
}

export const ALL_GOALS = [
  "card_open_detail",
  "quote_modal_open",
  "quote_submit",
  "quiz_open",
  "quiz_step_1",
  "quiz_submit",
  "email_subscribe",
  "quick_contact_open",
  "quick_contact_submit",
  "fulfillment_registration_submit",
  "sales_contact_submit",
] as const;

export function ymTestAll() {
  console.group("[YM] Тестовые конверсии");
  ALL_GOALS.forEach((goal) => ymGoal(goal, { test: true }));
  console.groupEnd();
}