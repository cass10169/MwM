import Link from "next/link";

export function SiteFooter({ socialLinks = [] }: { socialLinks?: Array<{ href: string; label: string }> }) {
  return (
    <footer className="site-footer">
      <div className="container-wide footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <span>Memories</span>
            <small>with Mike</small>
          </Link>
          <p>Photography. Exploration. Stories from the Wild.</p>
          <p>Lawrence, Kansas</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/prints">Fine-art prints</Link>
          <Link href="/journal">Field journal</Link>
          <Link href="/expeditions">Expeditions</Link>
        </div>
        <div>
          <h2>Work with Mike</h2>
          <Link href="/services">Photography services</Link>
          <Link href="/partners">Partnership opportunities</Link>
          <Link href="/media-kit">Media kit</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">Frequently asked questions</Link>
          <a href="mailto:michael.kennedy@ku.edu">michael.kennedy@ku.edu</a>
        </div>
        <div>
          <h2>Information</h2>
          <Link href="/order/lookup">Order lookup</Link>
          <Link href="/shipping-returns">Shipping &amp; returns</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          {socialLinks.map((item) => (
            <a href={item.href} key={item.href} rel="me noopener noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="container-wide footer-bottom">
        <p>© {new Date().getFullYear()} Memories with Mike. All rights reserved.</p>
        <p>Made with care in Lawrence, Kansas.</p>
      </div>
    </footer>
  );
}
