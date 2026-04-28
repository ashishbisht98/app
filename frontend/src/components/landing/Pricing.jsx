import React from "react";
import { Check, Sparkles } from "lucide-react";
import { useEnrollment } from "./EnrollmentDialog";

const PLANS = [
  {
    key: "regular",
    label: "Regular",
    price: "₹5,999",
    sub: "Full course access",
    features: [
      "1 month live online classes",
      "Both Android & iOS via Kotlin Multiplatform",
      "Firebase backend + Play Store publishing",
      "AI-assisted development workflow",
      "Live doubt-clearing sessions",
      "Project review & feedback",
    ],
    accent: false,
  },
  {
    key: "student",
    label: "Student",
    price: "₹4,999",
    sub: "₹1,000 off — verified students",
    features: [
      "Everything in Regular",
      "Student ID verification required",
      "Career guidance session",
      "Priority WhatsApp support",
      "Resume review",
      "Interview prep checklist",
    ],
    accent: true,
  },
];

export default function Pricing() {
  const { openDialog, setPlan } = useEnrollment();

  const buy = (key) => {
    setPlan(key);
    openDialog();
  };

  return (
    <section id="pricing" className="border-b border-grid" data-testid="pricing-section">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal mb-4">
              / Pricing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-white">
              One course. Two simple prices.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Pay once. No hidden fees, no upsells. Students get a flat ₹1,000 off
              on verification — because we want builders, not gatekeepers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-grid">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`relative border-r border-b border-grid p-8 md:p-10 lg:p-12 ${
                p.accent ? "bg-void-surface" : "bg-void"
              }`}
              data-testid={`plan-${p.key}`}
            >
              {p.accent && (
                <div className="absolute top-0 right-0 bg-signal text-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1">
                  <Sparkles size={12} /> Best Value
                </div>
              )}
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
                {p.key === "student" ? "Plan B" : "Plan A"}
              </div>
              <h3 className="font-display text-3xl text-white mb-1">{p.label}</h3>
              <div className="text-zinc-500 text-sm mb-6">{p.sub}</div>

              <div className="flex items-baseline gap-3 pb-6 border-b border-grid">
                <span className={`font-display text-5xl lg:text-6xl ${p.accent ? "text-signal" : "text-white"}`}>
                  {p.price}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                  / one-time
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-zinc-300 text-sm"
                  >
                    <Check
                      size={16}
                      className={p.accent ? "text-signal" : "text-electric"}
                      strokeWidth={2.5}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => buy(p.key)}
                className={`mt-8 w-full font-medium py-4 transition-colors ${
                  p.accent
                    ? "bg-signal hover:bg-signal-hover text-white"
                    : "border border-gridhi hover:border-white text-white"
                }`}
                data-testid={`plan-cta-${p.key}`}
              >
                Enroll for {p.price}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Secure payments by Razorpay · UPI · Cards · Netbanking · Wallets
        </p>
      </div>
    </section>
  );
}
