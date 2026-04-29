import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useEnrollment } from "./EnrollmentDialog";

const NAV = [
  { label: "Curriculum", href: "#curriculum" },
  { label: "Stack", href: "#stack" },
  { label: "Schedule", href: "#schedule" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { openDialog } = useEnrollment();

  return (
    <header
      className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-grid"
      data-testid="site-header"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2" data-testid="brand-logo">
          <span className="font-display text-2xl font-bold tracking-tighter text-ink">
            Orchitek
          </span>
          <span className="block w-2 h-2 bg-signal" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink hover:text-signal transition-colors"
              data-testid={`nav-${n.label.toLowerCase()}`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openDialog}
            className="hidden sm:inline-flex bg-signal hover:bg-signal-hover text-white rounded-md font-medium px-5 py-2.5 transition-colors"
            data-testid="header-enroll-btn"
          >
            Enroll Now
          </button>
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-btn"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-grid bg-void">
          <div className="flex flex-col p-6 gap-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink"
                data-testid={`mobile-nav-${n.label.toLowerCase()}`}
              >
                {n.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); openDialog(); }}
              className="bg-signal hover:bg-signal-hover text-white rounded-md font-medium px-5 py-3 mt-2"
              data-testid="mobile-enroll-btn"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
