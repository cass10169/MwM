import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="status-page section-dark">
      <div className="container-narrow">
        <p className="eyebrow">404 · Beyond the frame</p>
        <h1>This trail doesn’t lead to a photograph.</h1>
        <p>The page may have moved, changed its title, or returned to draft.</p>
        <div className="button-row">
          <Link className="button button-light" href="/">
            Return home
          </Link>
          <Link className="text-link light" href="/portfolio">
            Explore the portfolio →
          </Link>
        </div>
      </div>
    </main>
  );
}
