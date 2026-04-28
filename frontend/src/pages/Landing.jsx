import React from "react";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Marquee from "../components/landing/Marquee";
import WhatYouLearn from "../components/landing/WhatYouLearn";
import TechStack from "../components/landing/TechStack";
import Schedule from "../components/landing/Schedule";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import WhatsAppFloat from "../components/landing/WhatsAppFloat";
import EnrollmentDialog, { EnrollmentProvider } from "../components/landing/EnrollmentDialog";

export default function Landing() {
  return (
    <EnrollmentProvider>
      <div className="bg-void text-ink min-h-screen font-sans">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <WhatYouLearn />
          <TechStack />
          <Schedule />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
        <WhatsAppFloat />
        <EnrollmentDialog />
      </div>
    </EnrollmentProvider>
  );
}
