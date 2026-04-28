import React from "react";

const ITEMS = [
  "Android Studio",
  "Kotlin Multiplatform",
  "Firebase",
  "Google Cloud Console",
  "Play Store Publishing",
  "REST APIs",
  "Authentication",
  "Architecture Patterns",
  "AI-Assisted Coding",
];

export default function Marquee() {
  const list = [...ITEMS, ...ITEMS];
  return (
    <div className="border-b border-grid overflow-hidden bg-void" data-testid="marquee">
      <div className="flex animate-marquee whitespace-nowrap py-5">
        {list.map((t, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-600 mx-8 flex items-center gap-8"
          >
            {t}
            <span className="text-signal">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
