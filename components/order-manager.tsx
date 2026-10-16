"use client";

import { useState } from "react";

const transitions: Record<string, string[]> = {
  READY: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["IN_PRODUCTION", "CANCELLED"],
  IN_PRODUCTION: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function OrderManager({
  id,
  currentStatus,
  totalCents,
}: {
  id: string;
  currentStatus: string;
  totalCents: number;
}) {
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);
  const post = async (path: string, payload: unknown, success: string) => {
    setWorking(true);
    setStatus("");
    const response = await fetch(`/api/admin/orders/${id}/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string };
    setWorking(false);
    setStatus(response.ok ? success : (body.error ?? "The order could not be updated."));
    if (response.ok && path === "status") window.location.reload();
  };
  const submitStatus = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void post(
      "status",
      {
        status: form.get("status"),
        providerOrderId: form.get("providerOrderId") || undefined,
        carrier: form.get("carrier") || undefined,
        trackingNumber: form.get("trackingNumber") || undefined,
        trackingUrl: form.get("trackingUrl") || undefined,
        internalNotes: form.get("internalNotes") || undefined,
      },
      "Fulfillment updated and the customer notification was processed.",
    );
  };
  const submitRefund = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = String(form.get("amount") ?? "");
    const match = value.match(/^(\d+)(?:\.(\d{1,2}))?$/);
    if (!match) {
      setStatus("Enter a valid refund amount.");
      return;
    }
    const amountCents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
    void post(
      "refund",
      { amountCents, recordOnly: form.has("recordOnly"), reason: form.get("reason") || undefined },
      "Refund recorded and customer notification processed.",
    );
  };
  return (
    <details className="order-manager">
      <summary>Manage order</summary>
      <div className="order-manager-grid">
        <form onSubmit={submitStatus}>
          <h3>Fulfillment</h3>
          <label className="form-field">
            <span>Next status</span>
            <select name="status" required>
              <option value="">Choose</option>
              {(transitions[currentStatus] ?? []).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Lab order number</span>
            <input name="providerOrderId" />
          </label>
          <label className="form-field">
            <span>Carrier</span>
            <input name="carrier" />
          </label>
          <label className="form-field">
            <span>Tracking number</span>
            <input name="trackingNumber" />
          </label>
          <label className="form-field">
            <span>Tracking URL</span>
            <input name="trackingUrl" type="url" />
          </label>
          <label className="form-field">
            <span>Internal notes</span>
            <textarea name="internalNotes" rows={3} />
          </label>
          <button className="admin-primary" disabled={working || !transitions[currentStatus]?.length}>
            Update fulfillment
          </button>
        </form>
        <form onSubmit={submitRefund}>
          <h3>Refund</h3>
          <label className="form-field">
            <span>Amount (USD)</span>
            <input name="amount" inputMode="decimal" placeholder={(totalCents / 100).toFixed(2)} required />
          </label>
          <label className="form-field">
            <span>Reason</span>
            <textarea name="reason" rows={3} />
          </label>
          <label className="admin-checkbox">
            <input name="recordOnly" type="checkbox" /> Record an externally issued refund only
          </label>
          <button className="admin-secondary" disabled={working}>
            Issue or record refund
          </button>
        </form>
        <div>
          <h3>Notifications</h3>
          <p>Resend a branded transactional update using the configured email provider.</p>
          <div className="admin-actions">
            <button
              type="button"
              disabled={working}
              onClick={() =>
                void post("notifications", { template: "ORDER_CONFIRMATION" }, "Order confirmation resent.")
              }
            >
              Order confirmation
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => void post("notifications", { template: "PRODUCTION_UPDATE" }, "Production update resent.")}
            >
              Production update
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() =>
                void post("notifications", { template: "SHIPPING_CONFIRMATION" }, "Shipping update resent.")
              }
            >
              Shipping update
            </button>
          </div>
        </div>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </details>
  );
}
