import { NextResponse } from "next/server";

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
  company?: string; // honeypot
};

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they move on.
  if (data.company) return NextResponse.json({ ok: true });

  if (data.type === "newsletter") {
    if (!data.email || !EMAIL_RE.test(data.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
    }
  } else {
    const errors: string[] = [];
    if (!data.name || data.name.trim().length < 2) errors.push("name");
    if (!data.phone || !PHONE_RE.test(data.phone.replace(/\s/g, ""))) errors.push("phone");
    if (data.email && !EMAIL_RE.test(data.email)) errors.push("email");
    if (!data.city || data.city.trim().length < 2) errors.push("city");
    if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Delivery hook: forward to email (Resend, SES), a CRM or a Google Sheet here.
  // Until then submissions only appear in the server logs.
  console.info(`[${data.type ?? "enquiry"}]`, JSON.stringify({ ...data, receivedAt: new Date().toISOString() }));

  return NextResponse.json({ ok: true });
}
