import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useEnrollment } from "./EnrollmentDialog";

const WHATSAPP_NUMBER = "919999999999";

export default function CTA() {
  const { openDialog } = useEnrollment();
  return (
    <section className="border-b border-grid relative overflow-hidden" data-testid="cta-section">
      <div className="absolute inset-0 bg-techgrid opacity-30" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-24 md:py-32">
        <div className="max-w-4xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mb-6">
            / Next batch · 1st of next month
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[0.95] text-ink">
            Stop watching tutorials.
            <br />
            <span className="text-signal">Ship a real app.</span>
          </h2>
          <p className="mt-8 text-lg text-warm-600 max-w-2xl leading-relaxed">
            Seats are limited per batch to keep classes interactive. Reserve yours now —
            or message us on WhatsApp if you want to talk first.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={openDialog}
              className="inline-flex items-center gap-2 bg-signal hover:bg-signal-hover text-white rounded-md font-medium px-7 py-4 transition-colors shadow-sm"
              data-testid="cta-enroll-btn"
            >
              Enroll Now <ArrowRight size={18} />
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Orchitek%2C%20I%20have%20a%20few%20questions%20about%20the%20Mobile%20App%20Course.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-gridhi hover:border-ink hover:bg-void-surface text-ink rounded-md font-medium px-7 py-4 transition-colors"
              data-testid="cta-whatsapp-btn"
            >
              <MessageCircle size={18} /> Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
