export function isSameOriginMutation(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function redactLogValue(value: unknown) {
  if (value instanceof Error) return value.message.slice(0, 500);
  return String(value)
    .replace(/(sk|whsec|re)_[A-Za-z0-9_-]+/g, "[REDACTED]")
    .slice(0, 500);
}
