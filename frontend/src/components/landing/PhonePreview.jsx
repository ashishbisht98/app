import React from "react";
import {
  Wifi,
  Battery,
  Signal,
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  BookOpen,
  Code2,
  ArrowRight,
} from "lucide-react";

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[9px] font-mono text-ink/70">
    <span className="font-medium">9:41</span>
    <div className="flex items-center gap-1">
      <Signal size={9} strokeWidth={2.5} />
      <Wifi size={9} strokeWidth={2.5} />
      <Battery size={11} strokeWidth={2.5} />
    </div>
  </div>
);

const Welcome = ({ onNext }) => (
  <div className="flex flex-col h-full">
    <StatusBar />
    <div className="px-5 pt-2 pb-3 border-b border-grid">
      <span className="font-display text-[15px] font-medium text-ink">Orchitek</span>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-signal/15 flex items-center justify-center">
        <Code2 size={20} className="text-signal" strokeWidth={1.8} />
      </div>
      <h3 className="font-display text-[16px] leading-tight text-ink px-2">
        Welcome to Orchitek!
      </h3>
      <p className="text-[10px] text-warm-500 leading-snug">
        Build real apps.<br />Live, online, hands-on.
      </p>
    </div>
    <div className="px-4 pb-5 rounded-xl">
      <button
        type="button"
        onClick={() => onNext && onNext()}
        className="w-full bg-signal text-white text-[11px] font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5"
      >
        Enroll Now <ArrowRight size={11} />
      </button>
    </div>
  </div>
);

const Login = ({ onNext, onBack }) => (
  <div className="flex flex-col h-full">
    <StatusBar />
    <div className="px-5 pt-2 pb-3 border-b border-grid flex items-center gap-1.5">
      <button type="button" onClick={() => onBack && onBack()} className="-ml-1">
        <ChevronLeft size={14} className="text-ink" strokeWidth={2} />
      </button>
      <span className="font-display text-[15px] font-medium text-ink">Sign In</span>
    </div>
    <div className="flex-1 px-4 pt-5">
      <h3 className="font-display text-[14px] text-ink mb-0.5">Login to Orchitek</h3>
      <p className="text-[9px] text-warm-500 mb-4">Continue your learning</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 border border-grid rounded-md bg-void">
          <Mail size={10} className="text-warm-500" strokeWidth={2} />
          <span className="text-[9px] text-warm-600">you@email.com</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border border-grid rounded-md bg-void">
          <Lock size={10} className="text-warm-500" strokeWidth={2} />
          <span className="text-[9px] text-warm-600 tracking-widest">••••••</span>
          <Eye size={10} className="ml-auto text-warm-400" strokeWidth={2} />
        </div>
      </div>
      <div className="text-right mt-2">
        <span className="text-[8px] text-signal font-medium">Forgot?</span>
      </div>
    </div>
    <div className="px-4 pb-5 rounded-xl">
      <button
        type="button"
        onClick={() => onNext && onNext()}
        className="w-full bg-signal text-white text-[11px] font-medium py-2.5 rounded-xl"
      >
        Sign In
      </button>
    </div>
  </div>
);

const Home = ({ onNext }) => {
  const cards = [
    { d: "Day 01", t: "Intro to Mobile" },
    { d: "Day 02", t: "Working with APIs" },
    { d: "Day 03", t: "Design & Coding Patterns" },
    { d: "Day 04", t: "Auth & Security" },
    { d: "Day 05", t: "Publishing App" },

  ];
  return (
    <div className="flex flex-col h-full">
      <StatusBar />
      <div className="px-5 pt-2 pb-3 border-b border-grid flex items-center justify-between">
        <span className="font-display text-[15px] font-medium text-ink">Home</span>
        <span className="block w-2 h-2 rounded-full bg-signal" />
      </div>
      <div className="flex-1 px-3 pt-3 space-y-1.5 overflow-hidden">
        <h3 className="font-display text-[13px] text-ink mb-1.5 px-1">
          Start Learning
        </h3>
        {cards.map((c) => (
          <div
            key={c.d}
            className="flex items-center gap-2 px-2.5 py-1.5 border border-grid rounded-md bg-void"
          >
            <div className="w-6 h-6 rounded-md bg-electric/15 flex items-center justify-center shrink-0">
              <BookOpen size={11} className="text-electric" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              {/* <div className="text-[7px] font-mono uppercase tracking-wider text-warm-500">
                {c.d}
              </div> */}
              <div className="text-[10px] text-ink leading-tight truncate">
                {c.t}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SCREENS = [Welcome, Login, Home];

export default function PhonePreview({ activeTab = 0, onChangeTab }) {
  const Screen = SCREENS[activeTab] || Welcome;

  const goto = (next) => {
    if (typeof onChangeTab === "function") onChangeTab(next);
  };
  return (
    <div className="relative mx-auto" style={{ width: 260 }} data-testid="phone-preview">
      {/* Side buttons */}
      <div className="absolute top-[88px] -left-[2px] w-[3px] h-7 bg-ink/85 rounded-l-sm" />
      <div className="absolute top-[124px] -left-[2px] w-[3px] h-12 bg-ink/85 rounded-l-sm" />
      <div className="absolute top-[108px] -right-[2px] w-[3px] h-16 bg-ink/85 rounded-r-sm" />

      {/* Frame */}
      <div className="relative rounded-[2.25rem] bg-ink p-[5px] shadow-[0_25px_60px_-15px_rgba(42,31,24,0.35)]">
        <div className="relative rounded-[1.95rem] overflow-hidden bg-void-surface" style={{ aspectRatio: "9/19" }}>
          {/* Dynamic island */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 w-16 h-4 rounded-full bg-ink" />
          {/* Animated screen swap */}
          <div
            key={activeTab}
            className="h-full bg-void-surface animate-fade-up"
          >
            <Screen
              onNext={() => goto(Math.min(activeTab + 1, SCREENS.length - 1))}
              onBack={() => goto(Math.max(activeTab - 1, 0))}
            />
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-warm-500">
        Live preview
      </div>
    </div>
  );
}
