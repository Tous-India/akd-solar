import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  type?: "enquiry" | "newsletter";
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  bill?: string;
  message?: string;
  service?: string;
  page?: string;
  company?: string; // honeypot
};

const esc = (v = "") => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const clip = (v: string | undefined, n: number) => (v ?? "").toString().trim().slice(0, n);

/**
 * Sends the email through Resend (https://resend.com) using its REST API.
 * Env vars (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  required
 *   ENQUIRY_TO      optional, defaults to site.email (comma-separate several addresses)
 *   ENQUIRY_FROM    optional, defaults to "AKD Solar Website <onboarding@resend.dev>".
 *                   With the default sender Resend only delivers to the email that owns the Resend account,
 *                   so either sign up to Resend with ENQUIRY_TO's address or verify akdsolar.com in Resend
 *                   and set e.g. "AKD Solar Website <website@akdsolar.com>".
 */
async function sendEmail(subject: string, rows: [string, string][], replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const to = (process.env.ENQUIRY_TO || site.email).split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.ENQUIRY_FROM || "AKD Solar Website <onboarding@resend.dev>";
  const filled = rows.filter(([, v]) => v);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#101828">
<h2 style="margin:0 0 12px;color:#b35900">${esc(subject)}</h2>
<table cellpadding="8" style="border-collapse:collapse">${filled
    .map(([k, v]) => `<tr><td style="border:1px solid #eee;background:#fbf8f2;font-weight:bold">${esc(k)}</td><td style="border:1px solid #eee">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>
<p style="color:#667085;font-size:13px;margin-top:16px">Sent from the website contact form.</p></div>`;
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they move on.
  if (data.company) return NextResponse.json({ ok: true });

  const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  try {
    if (data.type === "newsletter") {
      const email = clip(data.email, 120);
      if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
      await sendEmail(`New newsletter subscriber: ${email}`, [["Email", email], ["Received", when]], email);
    } else {
      const f = {
        name: clip(data.name, 80),
        phone: clip(data.phone, 20),
        email: clip(data.email, 120),
        city: clip(data.city, 60),
        bill: clip(data.bill, 60),
        service: clip(data.service, 80),
        message: clip(data.message, 1000),
        page: clip(data.page, 200),
      };
      const errors: string[] = [];
      if (f.name.length < 2) errors.push("name");
      if (!PHONE_RE.test(f.phone.replace(/\s/g, ""))) errors.push("phone");
      if (f.email && !EMAIL_RE.test(f.email)) errors.push("email");
      if (f.city.length < 2) errors.push("city");
      if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });

      await sendEmail(
        `New enquiry: ${f.name}, ${f.city}${f.service ? ` (${f.service})` : ""}`,
        [
          ["Name", f.name],
          ["Mobile", f.phone],
          ["Email", f.email],
          ["City", f.city],
          ["Interested in", f.service],
          ["Monthly bill", f.bill],
          ["Message", f.message],
          ["Sent from page", f.page],
          ["Received", when],
        ],
        f.email || undefined,
      );
    }
  } catch (err) {
    console.error("[enquiry] email failed", err, JSON.stringify(data));
    return NextResponse.json({ ok: false, error: "Could not send right now" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
