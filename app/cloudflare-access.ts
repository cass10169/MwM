import { createRemoteJWKSet, jwtVerify } from "jose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type CloudflareAccessUser = {
  displayName: string;
  email: string;
  fullName: string | null;
};

const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
const E2E_EMAIL_HEADER = "x-e2e-authenticated-user-email";
const ACCESS_REQUIRED_PATH = "/access-required";
const ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout";
const jwksByUrl = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

type AccessConfiguration = {
  audience: string;
  issuer: string;
  jwksUrl: URL;
};

function accessConfiguration(): AccessConfiguration | null {
  const audience = process.env.CLOUDFLARE_ACCESS_AUD?.trim();
  const configuredDomain = process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN?.trim();
  if (!audience || !configuredDomain) return null;

  try {
    const domain = new URL(configuredDomain);
    if (domain.protocol !== "https:") return null;
    const issuer = domain.origin;
    return {
      audience,
      issuer,
      jwksUrl: new URL("/cdn-cgi/access/certs", issuer),
    };
  } catch {
    return null;
  }
}

function remoteJwks(url: URL) {
  const key = url.href;
  const existing = jwksByUrl.get(key);
  if (existing) return existing;
  const created = createRemoteJWKSet(url);
  jwksByUrl.set(key, created);
  return created;
}

export async function getCloudflareAccessUser(): Promise<CloudflareAccessUser | null> {
  const requestHeaders = await headers();

  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_E2E_FIXTURES === "true") {
    const fixtureEmail = requestHeaders.get(E2E_EMAIL_HEADER)?.trim().toLowerCase();
    if (fixtureEmail)
      return {
        displayName: fixtureEmail,
        email: fixtureEmail,
        fullName: null,
      };
  }

  const configuration = accessConfiguration();
  const assertion = requestHeaders.get(ACCESS_JWT_HEADER);
  if (!configuration || !assertion) return null;

  try {
    const { payload } = await jwtVerify(assertion, remoteJwks(configuration.jwksUrl), {
      audience: configuration.audience,
      issuer: configuration.issuer,
    });
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    if (!email) return null;
    const fullName = typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : null;
    return {
      displayName: fullName ?? email,
      email,
      fullName,
    };
  } catch {
    return null;
  }
}

export async function requireCloudflareAccessUser(returnTo: string): Promise<CloudflareAccessUser> {
  const user = await getCloudflareAccessUser();
  if (user) return user;
  redirect(cloudflareAccessRequiredPath(returnTo));
}

export function cloudflareAccessRequiredPath(returnTo: string): string {
  return `${ACCESS_REQUIRED_PATH}?return_to=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}

export function cloudflareAccessSignOutPath(): string {
  return ACCESS_LOGOUT_PATH;
}

function safeRelativeReturnPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";

  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local" || url.pathname === ACCESS_REQUIRED_PATH) return "/admin";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin";
  }
}
