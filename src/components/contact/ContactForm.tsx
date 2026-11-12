"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { whatsappHref } from "@/lib/site";
import { solutions } from "@/lib/data";

type Fields = { name: string; phone: string; email: string; city: string; bill: string; message: string; company: string };
type Errors = Partial<Record<keyof Fields, string>>;

const BILL_OPTIONS = ["Below ₹1,500", "₹1,500 – ₹3,000", "₹3,000 – ₹5,000", "₹5,000 – ₹10,000", "Above ₹10,000", "Commercial / industrial"];

const blank: Fields = { name: "", phone: "", email: "", city: "", bill: "", message: "", company: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  const phone = f.phone.replace(/[\s-]/g, "");
  if (!phone) e.phone = "Please enter your mobile number.";
  else if (!/^(?:\+?91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "That email address doesn't look right.";
  if (f.city.trim().length < 2) e.city = "Please tell us your city.";
  if (f.message.length > 1000) e.message = "Please keep your message under 1,000 characters.";
  return e;
}

export function ContactForm({ defaultCity = "", title = "Book a free site visit" }: { defaultCity?: string; title?: string } = {}) {
  const initial: Fields = { ...blank, city: defaultCity };
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Pre-select a service passed as ?service=slug
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const svc = solutions.find((s) => s.slug === slug);
    if (svc) setFields((f) => ({ ...f, message: f.message || `I'm interested in ${svc.title}.` }));
  }, []);

  useGSAP(
    () => {
      if (status !== "success" || !successRef.current) return;
      successRef.current.focus();
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline()
          .from(successRef.current, { autoAlpha: 0, y: 20, duration: 0.6 })
          .fromTo("[data-check-circle]", { strokeDashoffset: 160 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.1)
          .fromTo("[data-check-mark]", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 0.6);
      });
      return () => mm.revert();
    },
    { dependencies: [status], scope: successRef },
  );

  const update = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [key]: e.target.value };
    setFields(next);
    if (touched[key]) setErrors(validate(next));
  };

  const blur = (key: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(fields));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, city: true, message: true });
    const firstInvalid = (Object.keys(errs) as (keyof Fields)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "enquiry", ...fields }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const firstName = fields.name.trim().split(" ")[0];
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-center rounded-card border border-line bg-white p-8 text-center outline-none sm:p-12">
        <svg viewBox="0 0 64 64" className="size-20" aria-hidden>
          <circle data-check-circle cx="32" cy="32" r="25" fill="none" stroke="#2E8B1E" strokeWidth="4" strokeDasharray="160" />
          <path data-check-mark d="M21 33l7 7 15-16" fill="none" stroke="#2E8B1E" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" />
        </svg>
        <h2 className="mt-6 font-display text-h3 font-bold">Thank you, {firstName}! Your request is in.</h2>
        <p className="mt-3 max-w-md text-muted">
          A solar advisor will call you on <strong className="text-ink">{fields.phone}</strong> within one working day to schedule your free site survey.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href={whatsappHref(`Hi AKD Solar, I just submitted an enquiry on your website. My name is ${fields.name.trim()}.`)} iconLeft="whatsapp" icon={null} variant="dark">
            Continue on WhatsApp
          </Button>
          <Button
            variant="secondary"
            icon={null}
            onClick={() => {
              setFields(initial);
              setTouched({});
              setErrors({});
              setStatus("idle");
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  const show = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative rounded-card border border-line bg-white p-6 sm:p-8 lg:p-10" aria-labelledby="enquiry-title">
      <h2 id="enquiry-title" className="font-display text-h3 font-bold">
        {title}
      </h2>
      <p className="mt-2 text-muted">
        Fields marked <span className="text-akd">*</span> are required. We never share your details.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={show("name")}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={update("name")}
            onBlur={blur("name")}
            className={inputClass(!!show("name"))}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? "name-error" : undefined}
            required
          />
        </Field>
        <Field id="phone" label="Mobile number" required error={show("phone")}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            value={fields.phone}
            onChange={update("phone")}
            onBlur={blur("phone")}
            className={inputClass(!!show("phone"))}
            aria-invalid={!!show("phone")}
            aria-describedby={show("phone") ? "phone-error" : undefined}
            required
          />
        </Field>
        <Field id="email" label="Email" hint="optional" error={show("email")}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={fields.email}
            onChange={update("email")}
            onBlur={blur("email")}
            className={inputClass(!!show("email"))}
            aria-invalid={!!show("email")}
            aria-describedby={show("email") ? "email-error" : undefined}
          />
        </Field>
        <Field id="city" label="City" required error={show("city")}>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="e.g. Sonipat"
            value={fields.city}
            onChange={update("city")}
            onBlur={blur("city")}
            className={inputClass(!!show("city"))}
            aria-invalid={!!show("city")}
            aria-describedby={show("city") ? "city-error" : undefined}
            required
          />
        </Field>
        <Field id="bill" label="Average monthly electricity bill" className="sm:col-span-2">
          <div className="relative">
            <select id="bill" name="bill" value={fields.bill} onChange={update("bill")} className={`${inputClass(false)} appearance-none pr-12`}>
              <option value="">Select a range</option>
              {BILL_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
          </div>
        </Field>
        <Field id="message" label="Message" hint="optional" error={show("message")} className="sm:col-span-2">
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Roof type, preferred visit time, or any questions…"
            value={fields.message}
            onChange={update("message")}
            onBlur={blur("message")}
            className={`${inputClass(!!show("message"))} min-h-32 py-3`}
            aria-invalid={!!show("message")}
            aria-describedby={show("message") ? "message-error" : undefined}
          />
        </Field>
        {/* Honeypot for bots */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={update("company")} />
        </div>
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-6 rounded-card bg-akd/10 p-4 text-sm font-medium text-akd">
          Sorry, something went wrong sending your enquiry. Please try again, or reach us on WhatsApp.
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={status === "sending"} magnetic className="w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Request free survey"}
        </Button>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Icon name="shield" className="size-4 text-solar-deep" /> No spam. No obligation.
        </p>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return `block min-h-13 w-full rounded-xl border bg-cream px-4 text-base text-ink placeholder:text-ink/40 transition-colors focus:bg-white focus:outline-none focus:ring-3 ${
    invalid ? "border-akd focus:ring-akd/20" : "border-line focus:border-panel focus:ring-panel/15"
  }`;
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-akd" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
        {hint ? <span className="ml-1 text-sm font-normal text-muted">({hint})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-akd">
          <Icon name="close" className="size-4 shrink-0" /> {error}
        </p>
      ) : null}
    </div>
  );
}
