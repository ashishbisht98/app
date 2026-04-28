import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Orchitek%2C%20I%27m%20interested%20in%20the%20Mobile%20App%20Course.`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-whatsapp text-white px-4 py-3 font-mono text-xs uppercase font-semibold tracking-[0.15em] rounded-md shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all"
      data-testid="whatsapp-float-btn"
    >
      <MessageCircle size={18} strokeWidth={2.5} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
