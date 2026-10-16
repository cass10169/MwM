import { z } from "zod";

const optionalUrl = z.union([z.url(), z.literal(""), z.undefined()]);
const environmentSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: optionalUrl,
    NEXT_PUBLIC_ANALYTICS_PROVIDER: z.enum(["none", "plausible", "google"]).optional(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
    ADMIN_EMAIL_ALLOWLIST: z.string().optional(),
    CLOUDFLARE_ACCESS_TEAM_DOMAIN: optionalUrl,
    CLOUDFLARE_ACCESS_AUD: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    RATE_LIMIT_SALT: z.string().optional(),
    REQUIRE_PRODUCTION_CONFIGURATION: z.enum(["true", "false"]).optional(),
  })
  .superRefine((value, context) => {
    if (value.NEXT_PUBLIC_ANALYTICS_PROVIDER === "plausible" && !value.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
      context.addIssue({ code: "custom", message: "Plausible analytics requires NEXT_PUBLIC_PLAUSIBLE_DOMAIN." });
    if (value.NEXT_PUBLIC_ANALYTICS_PROVIDER === "google" && !value.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
      context.addIssue({ code: "custom", message: "Google Analytics requires NEXT_PUBLIC_GOOGLE_ANALYTICS_ID." });
    if (value.REQUIRE_PRODUCTION_CONFIGURATION === "true") {
      const required = [
        "NEXT_PUBLIC_SITE_URL",
        "ADMIN_EMAIL_ALLOWLIST",
        "CLOUDFLARE_ACCESS_TEAM_DOMAIN",
        "CLOUDFLARE_ACCESS_AUD",
        "STRIPE_PUBLISHABLE_KEY",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "RESEND_API_KEY",
        "EMAIL_FROM",
        "RATE_LIMIT_SALT",
      ] as const;
      for (const key of required)
        if (!value[key])
          context.addIssue({ code: "custom", path: [key], message: `${key} is required for a production launch.` });
      if ((value.RATE_LIMIT_SALT?.length ?? 0) < 32)
        context.addIssue({
          code: "custom",
          path: ["RATE_LIMIT_SALT"],
          message: "RATE_LIMIT_SALT must contain at least 32 characters.",
        });
    }
  });

export function validateEnvironment(environment: Record<string, string | undefined> = process.env) {
  const result = environmentSchema.safeParse(environment);
  if (!result.success)
    throw new Error(
      `Invalid environment configuration: ${result.error.issues.map((issue) => issue.message).join(" ")}`,
    );
  return result.data;
}
