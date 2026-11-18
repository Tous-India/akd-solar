"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { telHref, site } from "@/lib/site";

type Fields = { name: string; phone: string; city: string; company: string };
const blank: Fields = { name: "", phone: "", city: "", company: "" };

/** Compact 3-field enquiry card for page headers (Solar Solutions pages). Posts to /api/enquiry, which emails the team. */
export function QuickEnquiry({ service }: { service: string }) {
  const [f, setF] = useState<Fields>(blank);
  const [err, setErr] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const check = (v: Fields) => {
    const e: typeof err = {};
    if (v.name.trim().length < 2) e.name = "Enter your name";
    if (!/^(?:\+?91)?[6-9]\d{9}$/.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid 10-digit mobile";
    if (v.city.trim().length < 2) e.city = "Enter your city";
    return e;
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errors = check(f);
    setErr(errors);
    if (Object.keys(errors).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "enquiry", ...f, service, page: window.location.pathname }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const input = (bad?: string) =>
    `w-full rounded-card border bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-sun focus:outline-none ${bad ? "border-akd" : "border-line"}`;

  if (status === "done") {
    return (
      <div role="status" className="rounded-card border border-line bg-white/95 p-6 text-center shadow-[0_20px_50px_-25px_rgb(10_23_48/0.35)]">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#2E8B1E]/10 text-[#2E8B1E]">
          <Icon name="check" className="size-6" />
        </span>
        <p className="mt-3 font-display text-lg font-bold text-ink">Thank you! We&apos;ll call you soon.</p>
        <p className="mt-1 text-sm text-muted">Our team will contact you within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="quick-enquiry-title" className="rounded-card border border-line bg-white/95 p-5 shadow-[0_20px_50px_-25px_rgb(10_23_48/0.35)] backdrop-blur sm:p-7">
      <p id="quick-enquiry-title" className="font-display text-xl font-bold text-ink">
        Get a free site visit
      </p>
      <p className="text-sm text-muted">For {service.toLowerCase()} solar. We call back within a day.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["name", "Your name", "text", "name"],
            ["phone", "Mobile number", "tel", "tel"],
            ["city", "City", "text", "address-level2"],
          ] as const
        ).map(([k, label, type, ac]) => (
          <div key={k} className={k === "name" ? "sm:col-span-2" : undefined}>
            <label htmlFor={`qe-${k}`} className="sr-only">
              {label}
            </label>
            <input
              id={`qe-${k}`}
              name={k}
              type={type}
              inputMode={k === "phone" ? "tel" : undefined}
              autoComplete={ac}
              placeholder={label}
              value={f[k]}
              onChange={(e) => {
                const next = { ...f, [k]: e.target.value };
                setF(next);
                if (err[k]) setErr(check(next));
              }}
              aria-invalid={!!err[k]}
              aria-describedby={err[k] ? `qe-${k}-err` : undefined}
              className={input(err[k])}
            />
            {err[k] ? (
              <p id={`qe-${k}-err`} className="mt-1 text-xs font-medium text-akd">
                {err[k]}
              </p>
            ) : null}
          </div>
        ))}
        {/* honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} className="hidden" aria-hidden />
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-3 text-sm font-medium text-akd">
          Couldn&apos;t send right now. Please call{" "}
          <a href={telHref()} className="underline">
            {site.phone}
          </a>
          .
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sun px-5 font-semibold text-ink transition-colors hover:bg-[#e8850f] disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Request a call back"}
        <Icon name="arrowRight" className="size-4" />
      </button>
    </form>
  );
}
