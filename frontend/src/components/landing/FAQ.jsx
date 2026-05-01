import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need any prior coding experience?",
    a: "No. The course is built for absolute beginners. We start from the basics of programming and progress up to publishing real apps.",
  },
  {
    q: "What do I need to attend?",
    a: "Just a PC or laptop with a stable internet connection. We'll guide you through installing Android Studio and setting up the toolchain.",
  },
  {
    q: "Is the course really live?",
    a: "Yes — every class is live online. You can ask questions in real-time, share your screen during doubt sessions, and code along with the instructor.",
  },
  {
    q: "What's the difference between weekday and weekend batches?",
    a: "Weekday batches run Mon–Fri with 1-hour daily classes. Weekend batches run Saturday & Sunday with 3-hour deep dives. The total content is identical.",
  },
  {
    q: "Will I be able to build apps for both Android and iOS?",
    a: "Yes. We use Kotlin Multiplatform so you write one shared codebase that runs on both Android and iOS.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes — you'll get a verifiable course completion certificate, plus a project that's strong enough for resumes and portfolios.",
  },
  {
    q: "How does the student discount work?",
    a: "Send us your valid student ID via WhatsApp after enrolling. We'll verify and refund ₹1,000 — making your fee ₹4,999.",
  },
  {
    q: "What's the refund policy?",
    a: "If you attend the first week and feel the course isn't for you, you get a full refund. After that, partial refunds depend on classes attended.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="border-b border-grid" data-testid="faq-section">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="font-mono text-[14px] uppercase tracking-[0.18em] text-signal mb-4">
              / FAQ
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-ink">
              Things people ask before they sign up.
            </h2>
            <p className="mt-6 text-lg text-warm-600 leading-relaxed">
              Still have questions? Ping us on WhatsApp — we usually reply within
              an hour during working hours.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible className="rounded-2xl border border-grid bg-void overflow-hidden shadow-[0_15px_40px_-20px_rgba(42,31,24,0.18)]">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-grid last:border-b-0 px-5"
                >
                  <AccordionTrigger
                    data-testid={`faq-${i}`}
                    className="text-left text-ink font-display text-lg sm:text-xl hover:no-underline py-6"
                  >
                    <span className="flex items-start gap-4">
                      <span className="font-mono text-xs text-warm-500 mt-1.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-warm-600 leading-relaxed pl-10 pb-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
