import React from "react";
import { Check } from "lucide-react";

const STACK = [
  { name: "Android Studio", desc: "IDE", tag: "IDE" },
  { name: "Kotlin Multiplatform", desc: "Android + iOS from one codebase", tag: "Language" },
  { name: "Firebase", desc: "Auth, DB & cloud functions", tag: "Backend" },
  { name: "Google Developer Console", desc: "Play Store publishing", tag: "Publishing" },
  { name: "Google Cloud Console", desc: "Cloud infra & services", tag: "Cloud" },
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
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-signal mb-4">
              / Stack
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-white">
              The tools real teams ship with.
            </h2>
            <p className="mt-6 text-zinc-400 text-lg max-w-2xl leading-relaxed">
              You'll get hands-on with the same toolchain used by professional mobile
              teams. No toy frameworks. No dead-end stacks.
            </p>

            <div className="mt-10 border-t border-l border-grid">
              {STACK.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 border-r border-b border-grid hover:bg-void-surface transition-colors"
                  data-testid={`stack-${i}`}
                >
                  <div className="col-span-2 sm:col-span-1 border-r border-grid p-5 flex items-center justify-center font-mono text-xs text-zinc-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 sm:col-span-7 p-5 flex flex-col justify-center">
                    <div className="font-display text-lg sm:text-xl text-white">
                      {s.name}
                    </div>
                    <div className="text-sm text-zinc-500">{s.desc}</div>
                  </div>
                  <div className="col-span-12 sm:col-span-4 border-t sm:border-t-0 sm:border-l border-grid p-5 flex items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-grid overflow-hidden">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `url('${TECH_IMG}')` }}
              />
              <div className="p-6 border-t border-grid bg-void-surface">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4">
                  / Requirements
                </div>
                <ul className="space-y-3">
                  {REQS.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-zinc-300"
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
