import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Orchitek%2C%20I%27m%20interested%20in%20the%20Mobile%20App%20Course.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-whatsapp text-white px-5 py-3.5 font-mono text-xs uppercase font-semibold tracking-[0.15em] rounded-full shadow-[0_15px_35px_-10px_rgba(37,211,102,0.5)] hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-10px_rgba(37,211,102,0.6)] transition-all"
      data-testid="whatsapp-float-btn"
    >
      <MessageCircle size={18} strokeWidth={2.5} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
