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
            <div className="font-mono text-[14px] uppercase tracking-[0.18em] text-signal mb-4">
              / Pricing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-ink">
              One course. Two simple prices.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-lg text-warm-600 leading-relaxed">
              Pay once. No hidden fees, no upsells. Students get a flat ₹1,000 off
              on verification — because we want builders, not gatekeepers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`relative p-8 md:p-10 lg:p-12 rounded-2xl border ${
                p.accent
                  ? "bg-void-surface border-signal/20 shadow-[0_20px_50px_-20px_rgba(216,106,53,0.35)]"
                  : "bg-void border-grid shadow-[0_15px_40px_-20px_rgba(42,31,24,0.18)]"
              }`}
              data-testid={`plan-${p.key}`}
            >
              {p.accent && (
                <div className="absolute -top-3 right-6 bg-signal text-white px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-[0.18em] flex items-center gap-1 shadow-md">
                  <Sparkles size={12} /> Best Value
                </div>
              )}
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-3">
                {p.key === "student" ? "Plan B" : "Plan A"}
              </div>
              <h3 className="font-display text-3xl text-ink mb-1">{p.label}</h3>
              <div className="text-warm-500 text-sm mb-6">{p.sub}</div>

              <div className="flex items-baseline gap-3 pb-6 border-b border-grid">
                <span className={`font-display text-5xl lg:text-6xl ${p.accent ? "text-signal" : "text-ink"}`}>
                  {p.price}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-warm-500">
                  course fee
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-warm-700 text-sm"
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
                className={`mt-8 w-full font-medium py-4 rounded-xl transition-all ${
                  p.accent
                    ? "bg-signal hover:bg-signal-hover text-white shadow-md hover:shadow-lg"
                    : "border border-gridhi hover:border-ink hover:bg-void-surface text-ink"
                }`}
                data-testid={`plan-cta-${p.key}`}
              >
                Reserve seat · ₹100 refundable
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500">
          Secure ₹100 token via Razorpay · UPI · Cards · Netbanking · Wallets · Course fee paid separately
        </p>
      </div>
    </section>
  );
}
