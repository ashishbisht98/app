import React from "react";

export default function Footer() {
  return (
    <footer className="bg-void border-t border-grid" data-testid="site-footer">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tighter text-ink">
                Orchitek
              </span>
              <span className="block w-2 h-2 bg-signal" />
            </div>
            <p className="mt-5 text-sm text-warm-500 max-w-md leading-relaxed">
              Live online programs that turn beginners into shipping mobile developers.
              Learn the workflow, ship to the Play Store, build something profitable.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-4">
              / Course
            </div>
            <ul className="space-y-3">
              <li><a href="#curriculum" className="text-sm text-warm-700 hover:text-ink">Curriculum</a></li>
              <li><a href="#stack" className="text-sm text-warm-700 hover:text-ink">Tech stack</a></li>
              <li><a href="#schedule" className="text-sm text-warm-700 hover:text-ink">Schedule</a></li>
              <li><a href="#pricing" className="text-sm text-warm-700 hover:text-ink">Pricing</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-4">
              / Contact
            </div>
            <ul className="space-y-3 text-sm text-warm-700">
              <li>hello@orchitek.in</li>
              <li>WhatsApp: +91-99999-99999</li>
              <li>India · Online</li>
            </ul>
          </div>
        </div>

        <div className="section-rule mt-12" />
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-400">
            © {new Date().getFullYear()} Orchitek · All rights reserved
          </div>
           <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-400">
            Build v1.0.1
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-400">
            Built with focus, not fluff.
          </div>
        </div>
      </div>
    </footer>
  );
}
