"use client";
import { cloneElement, useId, useRef, useState, type ReactElement } from "react";
import { inquirySchema, type InquiryData } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

export function InquiryForm({ initialType = "", image, session = "" }: { initialType?: string; image?: {slug:string;title:string}; session?:string }) {
  const [status, setStatus] = useState("");
  const [inquiryType, setInquiryType] = useState(initialType);
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryData,string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const brand = ["Brand Partnership","Expedition Partnership","Commercial Photography"].includes(inquiryType);
  const license = inquiryType === "Licensing";
  const print = ["Print Question","Print consultation"].includes(inquiryType);
  const local = inquiryType === "Photography Services";
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || sent) return;
    setStatus(""); setErrors({});
    const data = new FormData(event.currentTarget);
    const parsed = inquirySchema.safeParse({...Object.fromEntries(data), consent:data.get("consent")==="on"});
    if (!parsed.success) {
      const next: Partial<Record<keyof InquiryData,string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof InquiryData] = issue.message;
      setErrors(next);
      requestAnimationFrame(()=>summary.current?.focus());
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/inquiries", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(parsed.data)});
      if (!response.ok) {
        const result = await response.json();
        throw new Error(typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "Please try again or email Michael directly.");
      }
      setSent(true);
      trackEvent(license ? "licensing_inquiry_submitted" : print ? "print_inquiry_submitted" : local ? "photography_inquiry_submitted" : inquiryType === "Expedition Partnership" ? "expedition_inquiry_submitted" : brand ? "partnership_inquiry_submitted" : "contact_inquiry", {service:inquiryType});
      setStatus("Your inquiry has been received. Michael will review your brief and respond using the email you provided. No booking, purchase or license is confirmed until you agree on the details.");
    } catch(error) { setStatus(error instanceof Error ? error.message : "Please try again or email Michael directly."); }
    finally { setSending(false); }
  };
  const field = (name: keyof InquiryData, label: string, placeholder = "", type = "text") => <FormField key={name} label={label} error={errors[name]}><input name={name} type={type} placeholder={placeholder} maxLength={name === "email" ? 254 : 200} autoComplete={name === "name" ? "name" : name === "email" ? "email" : name === "company" ? "organization" : undefined}/></FormField>;
  return <form className="inquiry-form" onSubmit={submit} noValidate>
    {image && <div className="inquiry-context"><p className="eyebrow ink">Selected photograph</p><strong>{image.title}</strong><p>Your inquiry will include this photograph automatically.</p><input name="imageSlug" type="hidden" value={image.slug}/></div>}
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    {Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert" ref={summary} tabIndex={-1}><strong>Please review your inquiry.</strong><ul>{Object.entries(errors).map(([key,error])=><li key={key}>{error}</li>)}</ul></div>}
    <div className="form-grid">
      {field("name","Name")}{field("email","Email","","email")}
      <FormField label="Inquiry type" error={errors.serviceType}><select name="serviceType" value={inquiryType} onChange={event=>{setInquiryType(event.target.value);setErrors({});setSent(false);setStatus("");}}><option value="">Select an inquiry type</option>{["Brand Partnership","Expedition Partnership","Commercial Photography","Licensing","Print Question","Photography Services","General Inquiry"].map(t=><option key={t}>{t}</option>)}</select></FormField>
      {(brand || license) && <>{field("company","Company (optional)")}{field("companyWebsite","Company website (optional)","https://","url")}</>}
      {brand && <>
        <FormField label="Project type / partnership model (optional)"><select name="partnershipType"><option value="">Let’s discuss</option>{["Product Partnership","Expedition Partner","Content Partnership","Brand Ambassador","Commissioned Photography"].map(t=><option key={t}>{t}</option>)}</select></FormField>
        {field("projectSubject","Product, destination or campaign (optional)")}
        {field("deliverables","Desired deliverables (optional)","Hero images, social assets, field notes…")}
        {field("intendedUse","Intended usage (optional)","Website, campaign, publication…")}
        {field("location","Location / destination (optional)")}
        {field("budget","Approximate budget (optional)","Range and currency, or still planning")}
      </>}
      {(license || print) && !image && field("imageReference","Photograph title or image request","Name a photograph or describe the images you need")}
      {license && <>
        {field("intendedUse","Intended use","Describe the campaign or publication")}
        {field("media","Media (optional)","Website, social, brochure, editorial…")}
        {field("territory","Territory (optional)","Country, region or worldwide")}
        {field("duration","Usage duration (optional)","Dates, months or years")}
        <FormField label="Exclusivity (optional)"><select name="exclusivity"><option value="">Please advise</option><option>Non-exclusive</option><option>Exclusive use requested</option></select></FormField>
      </>}
      {print && <>
        <FormField label="Preferred dimensions (optional)"><select name="printSize"><option value="">Please advise</option><option>Small — up to 12 inches on the long edge</option><option>Medium — 13–24 inches on the long edge</option><option>Large — over 24 inches on the long edge</option><option>Custom — details in my message</option></select></FormField>
        <FormField label="Preferred medium (optional)"><select name="printMedium"><option value="">Please advise</option><option>Paper</option><option>Canvas</option><option>Metal</option><option>Other — details in my message</option></select></FormField>
        {field("shippingDestination","Shipping country and ZIP / postcode (optional)")}
        <p className="field-wide">These are preferences for a quote, not a list of confirmed products. Michael checks available sizes and media, image resolution, crop, total cost and delivery expectations before you order.</p>
      </>}
      {local && <>
        <FormField label="Photography service" error={errors.sessionType}><select name="sessionType" defaultValue={session}><option value="">Please advise</option>{["Weddings","Graduations","Families","Portraits","Events","Commissioned work"].map(t=><option key={t}>{t}</option>)}</select></FormField>
        {field("eventDate","Preferred date (optional)","","date")}
        {field("location","City / venue (optional)")}
        {field("coverage","Coverage requirements (optional)","Hours, people, key moments or deliverables")}
        {field("budget","Approximate budget (optional)")}
      </>}
      {!print && field("projectTiming",license ? "Campaign timing (optional)" : "Project timing (optional)","Month, season or planning window")}
      <FormField label={print ? "Questions or presentation details" : "Tell me about your project"} error={errors.message} className="field-wide"><textarea name="message" rows={5} maxLength={5000}/></FormField>
    </div>
    <label className="consent-field"><input name="consent" type="checkbox" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-error" : undefined}/><span>I agree that Memories with Mike may use this information to respond to my inquiry.</span></label>
    {errors.consent && <p className="field-error" id="consent-error">{errors.consent}</p>}
    <button className="button button-dark" disabled={sending || sent} type="submit">{sending ? "Sending…" : sent ? "Inquiry received" : "Send inquiry"}</button>
    <p className="form-status" role="status">{status}</p>
  </form>;
}
function FormField({label,error,className="",children}:{label:string;error?:string;className?:string;children:ReactElement<{id?:string;"aria-invalid"?:boolean;"aria-describedby"?:string}>}) {
 const id=useId();
 return <div className={`form-field ${className}`}><label htmlFor={id}>{label}</label>{cloneElement(children,{id,"aria-invalid":!!error,"aria-describedby":error?`${id}-error`:undefined})}{error&&<small className="field-error" id={`${id}-error`}>{error}</small>}</div>;
}
