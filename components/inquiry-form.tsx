"use client";

import { useState } from "react";
import { inquirySchema, type InquiryData } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

export function InquiryForm({ initialType = "" }: { initialType?: string }) {
  const [status, setStatus] = useState("");
  const [inquiryType, setInquiryType] = useState(initialType);
  const isBrand = ["Brand Partnership", "Expedition Partnership"].includes(inquiryType);
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryData, string>>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setErrors({});
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      serviceType: String(data.get("serviceType") ?? ""),
      eventDate: String(data.get("eventDate") ?? ""),
      company: String(data.get("company") ?? ""),
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      partnershipType: String(data.get("partnershipType") ?? ""),
      projectTiming: String(data.get("projectTiming") ?? ""),
      location: String(data.get("location") ?? ""),
      groupSize: String(data.get("groupSize") ?? ""),
      budget: String(data.get("budget") ?? ""),
      referral: String(data.get("referral") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };
    const parsed = inquirySchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof InquiryData, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof InquiryData] = issue.message;
      setErrors(next);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setInquiryType("");
      trackEvent("contact_inquiry", { service: parsed.data.serviceType });
      setStatus("Your inquiry has been received. Michael will respond using the email you provided.");
    } catch {
      setStatus("I couldn’t send that inquiry. Please try again or email Michael directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        <FormField label="Name" error={errors.name}>
          <input name="name" autoComplete="name" />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" />
        </FormField>
        <FormField label="Phone (optional)" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" />
        </FormField>
        <FormField label="Inquiry type" error={errors.serviceType}>
          <select name="serviceType" value={inquiryType} onChange={event => setInquiryType(event.target.value)}>
            <option value="" disabled>
              Select an inquiry type
            </option>
            <option>Brand Partnership</option>
            <option>Expedition Partnership</option>
            <option>Commercial Photography</option>
            <option>Licensing</option>
            <option>Print Question</option>
            <option>Photography Services</option>
            <option>General Inquiry</option>
            <option>Wedding</option>
            <option>Graduation</option>
            <option>Family portraits</option>
            <option>Event</option>
            <option>Commercial or commissioned work</option>
            <option>Print consultation</option>
            <option>Other</option>
          </select>
        </FormField>
        {isBrand && <>
          <FormField label="Company (optional)" error={errors.company}><input name="company" autoComplete="organization" /></FormField>
          <FormField label="Company website (optional)" error={errors.companyWebsite}><input name="companyWebsite" type="url" placeholder="https://" /></FormField>
          <FormField label="Partnership model (optional)" error={errors.partnershipType}><select name="partnershipType"><option value="">Let’s discuss</option><option>Product Partnership</option><option>Expedition Partner</option><option>Content Partnership</option><option>Brand Ambassador</option></select></FormField>
        </>}
        <FormField label="Approximate project timing (optional)" error={errors.projectTiming}><input name="projectTiming" placeholder="Month, season, or planning window" /></FormField>
        <FormField label="Event date (optional)" error={errors.eventDate}>
          <input name="eventDate" type="date" />
        </FormField>
        <FormField label="Location" error={errors.location}>
          <input name="location" placeholder="City, venue, or destination" />
        </FormField>
        <FormField label="Estimated group size (optional)" error={errors.groupSize}>
          <input name="groupSize" />
        </FormField>
        <FormField label="Budget range (optional)" error={errors.budget}>
          <select name="budget" defaultValue="">
            <option value="">Prefer not to say yet</option>
            <option>Under $500</option>
            <option>$500–$1,000</option>
            <option>$1,000–$2,500</option>
            <option>$2,500–$5,000</option>
            <option>$5,000+</option>
          </select>
        </FormField>
        <FormField label="How did you find Memories with Mike? (optional)" error={errors.referral}>
          <input name="referral" />
        </FormField>
        <FormField className="field-wide" label="Tell me about the photographs you want" error={errors.message}>
          <textarea name="message" rows={7} />
        </FormField>
      </div>
      <label className="consent-field">
        <input name="consent" type="checkbox" />{" "}
        <span>I agree that Memories with Mike may use this information to respond to my inquiry.</span>
      </label>
      {errors.consent && <p className="field-error">{errors.consent}</p>}
      <button className="button button-dark" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Sending…" : "Send inquiry"}
      </button>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

function FormField({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
