/**
 * Settings (API keys, phone numbers…) come from Cloudflare's
 * "Variables and Secrets". The Worker passes them in with setEnv().
 */
let current: Record<string, unknown> = {};

export function setEnv(values: Record<string, unknown>) {
  current = values;
}

export function env(name: string): string | undefined {
  const value = current[name];
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return undefined;
}
