import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
// Allow either ".../api" or "..." as env var.
const API = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

const EnrollmentContext = createContext(null);

export const useEnrollment = () => {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be inside EnrollmentProvider");
  return ctx;
};

export function EnrollmentProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState("regular");
  const [schedule, setSchedule] = useState("weekday");

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return (
    <EnrollmentContext.Provider
      value={{ open, setOpen, openDialog, closeDialog, plan, setPlan, schedule, setSchedule }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

const REGISTRATION_FEE = 100;
const COURSE_FEE = { regular: 5999, student: 4999 };

export default function EnrollmentDialog() {
  const { open, setOpen, plan, setPlan, schedule, setSchedule } = useEnrollment();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setSuccess(false);
  };

  const handleClose = (v) => {
    setOpen(v);
    if (!v) setTimeout(reset, 300);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill name, email and phone.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/enrollments`, {
        ...form,
        plan,
        schedule,
      });

      // Test mode → just save lead, no checkout
      if (data.test_mode || !data.order_id) {
        toast.success("We've got your details! We'll reach out shortly to confirm payment & batch.");
        setSuccess(true);
        setLoading(false);
        return;
      }

      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        toast.error("Payment SDK failed to load. Please refresh.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Orchitek",
        description: `Refundable registration token · ${plan === "student" ? "Student" : "Regular"} (${schedule})`,
        order_id: data.order_id,
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#FF4400" },
        handler: async (resp) => {
          try {
            await axios.post(`${API}/enrollments/verify`, {
              enrollment_id: data.enrollment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success("Payment confirmed. Welcome to Orchitek!");
            setSuccess(true);
          } catch (err) {
            toast.error("Payment received but verification failed. We'll reach out.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rz = new Razorpay(options);
      rz.open();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-void-surface border border-grid text-ink max-w-lg p-0 rounded-md"
        data-testid="enrollment-dialog"
      >
        {success ? (
          <div className="p-8">
            <CheckCircle2 size={36} className="text-signal mb-4" strokeWidth={1.5} />
            <DialogHeader>
              <DialogTitle className="font-display text-3xl text-ink">
                You're in.
              </DialogTitle>
              <DialogDescription className="text-warm-600 text-base mt-2">
                Your seat is reserved. Your ₹{REGISTRATION_FEE} token is fully refundable
                if you choose not to enroll. We'll send batch joining instructions on
                WhatsApp shortly.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => handleClose(false)}
              className="mt-8 w-full bg-signal hover:bg-signal-hover text-white rounded-xl font-medium py-3 transition-colors shadow-md"
              data-testid="enrollment-close-btn"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-8" data-testid="enrollment-form">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mb-3">
              / Reserve your seat
            </div>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl text-ink tracking-tight">
                Enroll — Mobile App Course
              </DialogTitle>
              <DialogDescription className="text-warm-500 text-sm mt-1">
                Pay a refundable ₹{REGISTRATION_FEE} token · New batch starts on the 1st
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                  Full Name
                </Label>
                <Input
                  id="name"
                  data-testid="enroll-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 bg-void border-grid rounded-lg text-ink focus-visible:ring-signal focus-visible:ring-offset-0"
                  placeholder="Aarav Mehta"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="enroll-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 bg-void border-grid rounded-lg text-ink focus-visible:ring-signal focus-visible:ring-offset-0"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    data-testid="enroll-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 bg-void border-grid rounded-lg text-ink focus-visible:ring-signal focus-visible:ring-offset-0"
                    placeholder="+91 ..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                    Schedule
                  </Label>
                  <Select value={schedule} onValueChange={setSchedule}>
                    <SelectTrigger
                      className="mt-2 bg-void border-grid rounded-lg text-ink focus:ring-signal"
                      data-testid="enroll-schedule"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-void-surface border-grid text-ink rounded-md">
                      <SelectItem value="weekday">Weekday (Mon–Fri, 1hr)</SelectItem>
                      <SelectItem value="weekend">Weekend (Sat–Sun, 3hr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                    Plan
                  </Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger
                      className="mt-2 bg-void border-grid rounded-lg text-ink focus:ring-signal"
                      data-testid="enroll-plan"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-void-surface border-grid text-ink rounded-md">
                      <SelectItem value="regular">Regular — ₹5,999</SelectItem>
                      <SelectItem value="student">Student — ₹4,999</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                  Anything to share? (optional)
                </Label>
                <Textarea
                  id="message"
                  data-testid="enroll-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 bg-void border-grid rounded-none text-white focus-visible:ring-signal focus-visible:ring-offset-0 min-h-[72px]"
                  placeholder="Goals, background, questions..."
                />
              </div>
            </div>

            <div className="mt-6 rounded-md bg-warm-100/70 border border-grid px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-warm-600">
                  Refundable Token
                </span>
                <span className="font-display text-2xl text-ink">
                  ₹{REGISTRATION_FEE}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-warm-500 leading-snug">
                Pay just ₹{REGISTRATION_FEE} now to reserve your seat. Fully refundable
                if you choose not to enroll before batch start. Course fee
                (₹{COURSE_FEE[plan].toLocaleString("en-IN")}) is collected separately.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-grid pt-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm-500">
                  Pay now
                </div>
                <div className="font-display text-3xl text-ink">
                  ₹{REGISTRATION_FEE}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-signal hover:bg-signal-hover disabled:opacity-60 text-white rounded-md font-medium px-6 py-3 transition-colors shadow-sm"
                data-testid="enroll-submit"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Reserve Seat · ₹{REGISTRATION_FEE} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-warm-500 text-xs">
              <ShieldCheck size={14} className="text-electric" />
              Encrypted checkout · UPI · Cards · Netbanking · Wallets
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
