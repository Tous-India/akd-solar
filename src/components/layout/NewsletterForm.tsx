"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "loading" | "done">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email: email.trim() }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="mt-4 flex items-center gap-2 rounded-card bg-white/5 p-4 text-sm text-leaf">
        <Icon name="check" className="size-5" /> You&apos;re subscribed. Welcome to the sunny side!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-3 text-base text-cream placeholder:text-cream/45 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun text-ink transition-colors hover:bg-gold"
        >
          <Icon name="send" className="size-5" />
        </button>
      </div>
      {status === "error" ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-gold">
          Please enter a valid email address.
        </p>
      ) : null}
    </form>
  );
}
