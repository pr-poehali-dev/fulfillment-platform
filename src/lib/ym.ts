declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

const COUNTER_ID = 101026698;

export function ymGoal(goal: string, params?: Record<string, unknown>) {
  window.ym?.(COUNTER_ID, "reachGoal", goal, params);
}
