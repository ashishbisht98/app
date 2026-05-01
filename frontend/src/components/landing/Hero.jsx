import React, { useState } from "react";
import { ArrowRight, MessageCircle, Smartphone, Cpu } from "lucide-react";
import { useEnrollment } from "./EnrollmentDialog";
import PhonePreview from "./PhonePreview";

const HERO_IMG =
  "https://images.pexels.com/photos/18545023/pexels-photo-18545023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const WHATSAPP_NUMBER = "919999999999"; // placeholder

const CODE_TABS = [
  {
    name: "~/App.kt",
    code: `import androidx.compose.runtime.*
import androidx.compose.material.*

@Composable
fun App() {
    MaterialTheme {
        Column {
            Text("Welcome to Orchitek!")
            Button(onClick = { /* Navigate */ }) {
                Text("Enroll Now")
            }
        }
    }
}`,
  },

  {
    name: "~/Login.kt",
    code: `import androidx.compose.runtime.*
import androidx.compose.material.*

@Composable
fun Login() {
    MaterialTheme {
        Column {
            Text("Login to Orchitek")
            Button(onClick = { /* Authenticate */ }) {
                Text("Sign In")
            }
        }
    }
}`,
  },
  {
    name: "~/Home.kt",
    code: `import androidx.compose.runtime.*
import androidx.compose.material.*

@Composable
fun Home() {
    MaterialTheme {
        Column {
            Text("Orchitek Home Screen")
            Button(onClick = { /* Start course */ }) {
                Text("Start Learning")
            }
        }
    }
}`,
  },
];

export default function Hero() {
  const { openDialog } = useEnrollment();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-grid"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/60" />
      <div className="absolute inset-0 bg-techgrid opacity-60" />

      <div className="relative mx-auto max-w-[1500px] xs:px-6 sm:px-6 md:px-6 py-16 md:py-16 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 border border-grid px-3 py-1.5 mb-8 bg-void-surface/60 rounded-md">
              <span className="block w-2 h-2 bg-signal rounded-full animate-pulse" />
              <span className="font-sans font-bold text-[12px] uppercase tracking-[0.18em] rounded-xl text-warm-600">
                New batch starts on the 1st of every month
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-5xl lg:text-4
            xl xl:text-[58px] font-medium tracking-tight leading-[1.52] text-ink">
              Build real <span className="text-signal">Android &amp; iOS</span> apps.
              <br />
              From zero to <span className="underline decoration-signal decoration-[3px] underline-offset-[6px]">Play Store</span>.
            </h1>

            <p className="mt-8 max-w-2xl text-base sm:text-lg text-warm-600 leading-relaxed">
              A 1-month online live program that teaches you the full mobile workflow —
              frontend, backend, auth, security, APIs, architecture and AI-assisted
              development. No prior coding required.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={openDialog}
                className="inline-flex items-center gap-2 bg-signal hover:bg-signal-hover text-white rounded-xl font-medium px-7 py-4 transition-colors shadow-sm"
                data-testid="hero-enroll-btn"
              >
                Enroll Now <ArrowRight size={18} />
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Orchitek%2C%20I%27m%20interested%20in%20the%20Mobile%20App%20Course.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-gridhi hover:border-ink hover:bg-void-surface text-ink rounded-xl font-medium px-7 py-4 transition-colors"
                data-testid="hero-whatsapp-btn"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { k: "01", v: "1 month", l: "Duration" },
                { k: "02", v: "Live", l: "Online classes" },
                { k: "03", v: "Android + iOS", l: "Platforms" },
                { k: "04", v: "Rs. 4999", l: "Student price" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-grid bg-void/70 backdrop-blur-sm p-4 shadow-[0_8px_24px_-12px_rgba(42,31,24,0.15)]"
                  data-testid={`hero-stat-${s.k}`}
                >
                  <div className="font-mono font-bold text-[10px] uppercase tracking-[0.2em] text-warm-500">
                    {s.k} / {s.l}
                  </div>
                  <div className="mt-2 font-display text-xl sm:text-2xl text-ink">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:flex lg:col-span-6 pl-12 gap-5 items-end">
            <div className="relative flex-1 mb-4 border border-grid bg-void-surface p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4 gap-2 item-center">
                <div className="flex gap-1">
                  {CODE_TABS.map((tab, index) => (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none ${activeTab === index
                        ? "bg-signal"
                        : "bg-warm-300 hover:bg-warm-200"
                        }`}
                      aria-label={`Show ${tab.name}`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-warm-500">
                  {CODE_TABS[activeTab].name}
                </span>
              </div>
              <pre className="font-mono text-xs leading-relaxed text-warm-800 whitespace-pre-wrap">
                {CODE_TABS[activeTab].code}
              </pre>
            </div>
            <PhonePreview activeTab={activeTab} onChangeTab={setActiveTab} />
          </div>
        </div>
      </div>
    </section>
  );
}
