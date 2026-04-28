import React from "react";
import { Star } from "lucide-react";

const T = [
  {
    name: "Aarav Mehta",
    role: "CSE Student, IIT BHU",
    quote:
      "Joined with zero coding background. Shipped a working app to the Play Store in week 4. The architecture lessons are gold.",
    img: "https://images.pexels.com/photos/9568826/pexels-photo-9568826.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    name: "Sneha Reddy",
    role: "Frontend Engineer @ Startup",
    quote:
      "I needed to learn mobile fast. Kotlin Multiplatform clicked because the trainer focused on real industry patterns, not toy demos.",
    img: "https://images.pexels.com/photos/18699972/pexels-photo-18699972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    name: "Rahul Verma",
    role: "Indie Founder",
    quote:
      "The 'what to build' module is what makes Orchitek different. I now have a profitable side-app, not just a portfolio piece.",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    name: "Priya Iyer",
    role: "BCA Final Year",
    quote:
      "The student discount made it accessible. Live classes plus AI-assisted coding helped me ship faster than my college projects.",
    img: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    name: "Karthik Nair",
    role: "Career Switcher",
    quote:
      "Switched from finance to mobile dev. Got my first contract gig in week 6 — the auth & security module gave me real confidence.",
    img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    name: "Ananya Joshi",
    role: "Product Designer",
    quote:
      "Finally understand how my designs become real apps. iOS + Android from one codebase is a superpower for designers.",
    img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="border-b border-grid" data-testid="testimonials-section">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal mb-4">
            / Reviews
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-white">
            Builders who shipped, talking shop.
          </h2>
          <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
            Real outcomes from past batches — students, working engineers and indie
            founders who used Orchitek to ship production apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-grid">
          {T.map((t, i) => (
            <figure
              key={i}
              className="border-r border-b border-grid p-8 lg:p-10 bg-void hover:bg-void-surface transition-colors flex flex-col"
              data-testid={`testimonial-${i}`}
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} size={14} className="text-signal fill-signal" />
                ))}
              </div>
              <blockquote className="font-display text-lg text-white leading-snug mb-8 flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-5 border-t border-grid">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="w-10 h-10 object-cover grayscale"
                />
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
