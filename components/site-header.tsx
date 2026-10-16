"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { outdoorNavigation } from "@/lib/outdoor";

const defaultNavigation = outdoorNavigation;

export function SiteHeader({
  navigation = defaultNavigation,
  commerceEnabled = false,
}: {
  navigation?: Array<{ href: string; label: string }>;
  commerceEnabled?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const overlay = pathname === "/";
  return (
    <header className={`site-header ${overlay ? "header-overlay" : "header-solid"}`}>
      <div className="header-inner container-wide">
        <Link className="brand" href="/" aria-label="Memories with Mike, home">
          <span>Memories</span>
          <small>with Mike</small>
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
        <nav id="primary-navigation" className={open ? "nav-open" : ""} aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              className={pathname.startsWith(item.href) ? "active" : ""}
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <Link className="header-contact" href="/contact">Let’s talk ↗</Link>
          {commerceEnabled && (
            <Link className="cart-link" href="/cart">
              Cart{" "}
              <span className="cart-count" aria-label={`${count} items`}>
                {count}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
