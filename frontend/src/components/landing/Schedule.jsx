import React from "react";
import { Calendar, Clock } from "lucide-react";
import { useEnrollment } from "./EnrollmentDialog";

const OPTIONS = [
  {
    key: "weekday",
    label: "Weekdays",
    schedule: "Mon — Fri",
    duration: "1 hour / class",
    detail: "Daily bite-sized live sessions. Perfect if you want consistent pace alongside your routine.",
  },
  {
    key: "weekend",
    label: "Weekends",
    schedule: "Sat & Sun",
    duration: "3 hours / class",
    detail: "Long-form deep dives. Ideal for working professionals and full-time students.",
  },
];

export default function Schedule() {
  const { openDialog, setSchedule } = useEnrollment();

  const choose = (s) => {
    setSchedule(s);
    openDialog();
  };

  return (
    <section
      id="schedule"
      className="border-b border-grid"
      data-testid="schedule-section"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-[14px] uppercase tracking-[0.18em] text-signal mb-4">
            / Schedule
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.02] text-ink">
            Pick the rhythm that fits your life.
          </h2>
          <p className="mt-6 text-lg text-warm-600 leading-relaxed">
            New batches start the <span className="text-ink">1st of every month</span>.
            Course duration: <span className="text-ink">1 month</span>. Choose between
            two flexible class formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-grid">
          {OPTIONS.map((o) => (
            <div
              key={o.key}
              className="border-r border-b border-grid p-8 md:p-10 lg:p-12 group hover:bg-void-surface transition-colors"
              data-testid={`schedule-${o.key}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-3">
                    Option {o.key === "weekday" ? "A" : "B"}
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl text-ink">
                    {o.label}
                  </h3>
                </div>
                <Calendar size={24} className="text-warm-400 group-hover:text-signal transition-colors" strokeWidth={1.5} />
              </div>

              <div className="mt-8 flex items-center gap-6 pt-6 border-t border-grid">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-2">
                    Days
                  </div>
                  <div className="text-ink text-lg">{o.schedule}</div>
                </div>
                <div className="h-10 w-px bg-grid" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-2">
                    Length
                  </div>
                  <div className="text-ink text-lg flex items-center gap-2">
                    <Clock size={14} className="text-signal" /> {o.duration}
                  </div>
                </div>
              </div>

              <p className="mt-6 text-warm-600 text-sm leading-relaxed">
                {o.detail}
              </p>

              <button
                onClick={() => choose(o.key)}
                className="mt-8 inline-flex items-center gap-2 border border-gridhi hover:border-signal hover:text-signal text-ink rounded-md font-medium px-6 py-3 transition-colors"
                data-testid={`schedule-choose-${o.key}`}
              >
                Choose {o.label} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
