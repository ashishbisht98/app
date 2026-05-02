import React from "react";
import { Check } from "lucide-react";

const STACK = [
  {
    name: "Android Studio",
    desc: "IDE",
    tag: "IDE",
    blurb: "The industry-standard IDE for Android development — fast, feature-rich, and production-ready.",
  },
  {
    name: "Kotlin Multiplatform",
    desc: "Android + iOS from one codebase",
    tag: "Language",
    blurb: "Write shared business logic once and ship native apps on multiple platforms.",
  },
  {
    name: "Firebase",
    desc: "Auth, DB & cloud functions",
    tag: "Backend",
    blurb: "Real-time database, auth, and serverless functions to accelerate development and iterate quickly.",
  },
  {
    name: "Google Developer Console",
    desc: "Play Store publishing",
    tag: "Publishing",
    blurb: "Manage releases, app signing, and distribution to millions of users with confidence.",
  },
  {
    name: "Google Cloud Console",
    desc: "Cloud infra & services",
    tag: "Cloud",
    blurb: "Scalable cloud services and observability to run production-grade mobile backends.",
  },
];

const REQS = [
  "A PC or Laptop",
  "A working internet connection",
  "No programming knowledge required",
];

const TECH_IMG =
  "https://images.pexels.com/photos/33607948/pexels-photo-33607948.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function TechStack() {
  return (
    <section
      id="stack"
      className="border-b border-grid relative"
      data-testid="techstack-section"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="font-mono text-[14px] uppercase tracking-[0.18em] text-signal mb-4">
              / Stack
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-ink">
              The tools real teams ship with.
            </h2>
            <p className="mt-6 text-warm-600 text-lg max-w-2xl leading-relaxed">
              You'll get hands-on with the same toolchain used by professional mobile
              teams. No toy frameworks. No dead-end stacks.
            </p>

            <div className="mt-10 rounded-2xl bg-void border border-grid shadow-[0_15px_40px_-20px_rgba(42,31,24,0.18)] overflow-hidden">
              {STACK.map((s, i) => (
                <div
                  key={i}
                  className={`group grid grid-cols-12 relative cursor-default transition-colors duration-250 hover:bg-void-surface ${i !== STACK.length - 1 ? "border-b border-grid" : ""
                    }`}
                  data-testid={`stack-${i}`}
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-warm-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center rounded-r-sm" />

                  {/* Row number */}
                  <div className="col-span-2 sm:col-span-1 border-r border-grid p-5 flex items-start justify-center font-mono text-xs text-warm-500 pt-[22px]">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Main content */}
                  <div className="col-span-10 sm:col-span-7 px-5 pt-4 pb-4 flex flex-col justify-center">
                    <div className="font-display text-lg sm:text-xl text-ink">{s.name}</div>
                    <div className="text-sm text-warm-500">{s.desc}</div>

                    {/* Inline blurb reveal */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      <div className="overflow-hidden">
                        <p className="mt-2 px-3 py-2 rounded-md bg-void-muted text-xs text-warm-600 leading-relaxed opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-250 delay-100 ease-[cubic-bezier(0.4,0,0.2,1)] m-0">
                          {s.blurb}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="col-span-12 sm:col-span-4 border-t sm:border-t-0 sm:border-l border-grid p-5 flex items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 transition-colors duration-250 group-hover:text-warm-400">
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-grid bg-void shadow-[0_15px_40px_-20px_rgba(42,31,24,0.18)] overflow-hidden">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url('${TECH_IMG}')` }}
              />
              <div className="p-6 border-t border-grid bg-void-surface">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-4">
                  / Requirements
                </div>
                <ul className="space-y-3">
                  {REQS.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-warm-700"
                      data-testid={`req-${i}`}
                    >
                      <Check size={18} className="text-signal mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
