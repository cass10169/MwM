"use client";
import { useState } from "react";
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState("");
  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setStatus("Link copied.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Copy the page address to share.");
    }
  };
  return (
    <>
      <button className="favorite-button" type="button" onClick={() => void share()}>
        Share
      </button>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
