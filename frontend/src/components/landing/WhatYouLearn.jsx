import React from "react";
import {
  Workflow,
  Plug,
  Palette,
  GitBranch,
  Sparkles,
  Target,
} from "lucide-react";

const ITEMS = [
  {
    n: "01",
    icon: Workflow,
    title: "End-to-end mobile workflow",
    desc: "Frontend, Backend, Authentication and Security — wired together the way real production apps are built.",
  },
  {
    n: "02",
    icon: Plug,
    title: "Working with APIs",
    desc: "Consume REST APIs, handle async data, errors, retries and offline state confidently.",
  },
  {
    n: "03",
    icon: Palette,
    title: "Design standards",
    desc: "Material Design + iOS HIG essentials so your apps look and feel right on both platforms.",
  },
  {
    n: "04",
    icon: GitBranch,
    title: "Industry coding patterns",
    desc: "MVVM, clean architecture, dependency injection and testable code — the patterns startups expect.",
  },
  {
    n: "05",
    icon: Sparkles,
    title: "Build fast with AI",
    desc: "Use modern AI tools to ship features faster without losing the fundamentals.",
  },
  {
    n: "06",
    icon: Target,
    title: "What to build, not just how",
    desc: "Identify useful, profitable app ideas and ship products people actually want.",
  },
];

export default function WhatYouLearn() {
  return (
    <section
      id="curriculum"
      className="border-b border-grid relative"
      data-testid="curriculum-section"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-5">
            <div className="font-mono text-[14px] uppercase tracking-[0.18em] text-signal mb-4">
              / Curriculum
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-ink">
              Everything you need to ship a real app.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-lg text-warm-600 leading-relaxed">
              Six focused modules covering the entire mobile development stack — from
              writing your first Kotlin function to publishing on the Play Store.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="group p-8 lg:p-10 bg-void hover:bg-void-surface transition-colors rounded-lg shadow-md hover:shadow-lg"
              data-testid={`curriculum-item-${n}`}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-display text-xs uppercase tracking-[0.18em] text-warm-500">
                  {n}
                </span>
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-warm-500 group-hover:text-signal transition-colors"
                />
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-ink mb-3 leading-tight">
                {title}
              </h3>
              <p className="text-sm text-warm-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
