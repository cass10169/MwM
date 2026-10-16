"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
export function PrintViewTracker({ slug }: { slug: string }) {
  useEffect(() => trackEvent("print_view", { slug }), [slug]);
  return null;
}
