"use client";
import { useState } from "react";
export function PhotographImport() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <details className="admin-panel import-panel">
      <summary>Import photographs from CSV</summary>
      <p>Use the provided template. Imported rows remain drafts unless the CSV explicitly sets another status.</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setStatus("");
          const response = await fetch("/api/admin/photographs/import", {
            method: "POST",
            body: new FormData(event.currentTarget),
          });
          const body = (await response.json()) as { error?: string; imported?: number };
          setLoading(false);
          setStatus(response.ok ? `${body.imported ?? 0} rows imported.` : (body.error ?? "Import failed."));
          if (response.ok) window.location.reload();
        }}
      >
        <input name="file" type="file" accept="text/csv,.csv" required />
        <button className="admin-primary" disabled={loading}>
          {loading ? "Importing…" : "Import CSV"}
        </button>
        <p className="form-status" aria-live="polite">
          {status}
        </p>
      </form>
    </details>
  );
}
