type EmailMessage = { to: string; subject: string; html: string; text: string };
const brand = (body: string) =>
  `<div style="font-family:Georgia,serif;color:#171813;max-width:620px;margin:auto;padding:36px"><p style="font:600 11px Arial;letter-spacing:.18em;text-transform:uppercase">Memories with Mike</p>${body}<hr style="border:0;border-top:1px solid #dedbd1;margin:32px 0"><p style="font:12px Arial;color:#77766d">Fine-art photography by Michael Kennedy · Lawrence, Kansas</p></div>`;
const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const emailTemplates = {
  inquiryConfirmation: (name: string): EmailMessage => ({
    to: "",
    subject: "Your Memories with Mike inquiry",
    text: `Thank you, ${name}. Michael has received your inquiry and will respond soon.`,
    html: brand(
      `<h1 style="font-weight:400">Thank you, ${escapeHtml(name)}.</h1><p>Your photography inquiry has been received. Michael will review the details and respond soon.</p>`,
    ),
  }),
  inquiryNotification: (name: string, service: string): EmailMessage => ({
    to: "",
    subject: `New ${service} inquiry from ${name}`,
    text: `A new inquiry from ${name} is ready in the administrator dashboard.`,
    html: brand(
      `<h1 style="font-weight:400">New photography inquiry</h1><p>${escapeHtml(name)} submitted a ${escapeHtml(service)} inquiry. Review it in the administrator dashboard.</p>`,
    ),
  }),
  orderConfirmation: (number: string): EmailMessage => ({
    to: "",
    subject: `Order ${number} received`,
    text: `Your Memories with Mike order ${number} has been received.`,
    html: brand(
      `<h1 style="font-weight:400">Your print order is received.</h1><p>Order ${escapeHtml(number)} is confirmed. Production updates will follow by email.</p>`,
    ),
  }),
  paymentConfirmation: (number: string, amount: string): EmailMessage => ({
    to: "",
    subject: `Payment confirmed for ${number}`,
    text: `Payment of ${amount} was confirmed for order ${number}.`,
    html: brand(
      `<h1 style="font-weight:400">Payment confirmed.</h1><p>Payment of ${escapeHtml(amount)} was confirmed for order ${escapeHtml(number)}.</p>`,
    ),
  }),
  productionUpdate: (number: string, status: string): EmailMessage => ({
    to: "",
    subject: `Order ${number}: ${status}`,
    text: `Your order is now ${status}.`,
    html: brand(
      `<h1 style="font-weight:400">A new step for your photograph.</h1><p>Order ${escapeHtml(number)} is now ${escapeHtml(status)}.</p>`,
    ),
  }),
  shippingConfirmation: (number: string, tracking: string): EmailMessage => ({
    to: "",
    subject: `Order ${number} has shipped`,
    text: `Your order has shipped. Tracking: ${tracking}`,
    html: brand(
      `<h1 style="font-weight:400">Your photograph is on its way.</h1><p>Order ${escapeHtml(number)} has shipped.</p><p>Tracking: ${escapeHtml(tracking)}</p>`,
    ),
  }),
  refundConfirmation: (number: string): EmailMessage => ({
    to: "",
    subject: `Refund for order ${number}`,
    text: `A refund was recorded for order ${number}.`,
    html: brand(
      `<h1 style="font-weight:400">Refund recorded</h1><p>A refund was recorded for order ${escapeHtml(number)}. Timing depends on the payment provider.</p>`,
    ),
  }),
  newsletterConfirmation: (confirmationUrl: string): EmailMessage => ({
    to: "",
    subject: "Confirm your Memories with Mike updates",
    text: `Confirm your subscription: ${confirmationUrl}`,
    html: brand(
      `<h1 style="font-weight:400">Follow the next memory.</h1><p>Confirm your email to receive occasional new releases and field notes.</p><p><a href="${escapeHtml(confirmationUrl)}">Confirm subscription</a></p>`,
    ),
  }),
  secureOrderLookup: (number: string): EmailMessage => ({
    to: "",
    subject: `Secure link for order ${number}`,
    text: "Use the time-limited link in this email to view your order.",
    html: brand(
      `<h1 style="font-weight:400">Your secure order link</h1><p>Use the link below to view order ${number}. It will expire automatically.</p>`,
    ),
  }),
};

export async function sendEmail(message: EmailMessage) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV !== "production")
      console.info("Email preview", { to: message.to, subject: message.subject });
    return { delivered: false, preview: true };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, html: message.html, text: message.text }),
  });
  if (!response.ok) throw new Error("Transactional email delivery failed.");
  return { delivered: true, preview: false };
}
