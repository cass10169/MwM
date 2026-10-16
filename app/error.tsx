"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="status-page section-dark">
      <div className="container-narrow">
        <p className="eyebrow">Something shifted</p>
        <h1>The page could not be completed.</h1>
        <p>The error was contained and no customer-facing technical details were exposed.</p>
        <button className="button button-light" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
