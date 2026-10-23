"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mail, WhatsApp } from "@/components/ui/Icons";
import { site, waLink } from "@/content/site";
import { cn } from "@/lib/utils";

type Fields = { name: string; phone: string; service: string; area: string; details: string };

const empty: Fields = { name: "", phone: "", service: "", area: "", details: "" };

function compose(f: Fields) {
  const lines = ["Hello Loyal Point Construction, I'd like a quote.", "", `Name: ${f.name.trim()}`];
  if (f.phone.trim()) lines.push(`Phone: ${f.phone.trim()}`);
  lines.push(`Service: ${f.service}`);
  if (f.area.trim()) lines.push(`Location: ${f.area.trim()}`);
  lines.push("", f.details.trim());
  return lines.join("\n");
}

/**
 * Quote request that becomes a ready-to-send WhatsApp message (or an email).
 * No backend: nothing is stored on the site. ?service=<slug> preselects a service.
 */
export function QuoteForm() {
  const [f, setF] = useState<Fields>(empty);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(location.search).get("service");
    const match = site.services.find((s) => s.slug === slug);
    if (match) setF((prev) => ({ ...prev, service: match.title }));
  }, []);

  const missing = {
    name: !f.name.trim(),
    service: !f.service,
    details: !f.details.trim(),
  };
  const valid = !missing.name && !missing.service && !missing.details;
  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    const url = waLink(compose(f));
    const win = window.open(url, "_blank", "noopener");
    if (!win) location.href = url;
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Quote request: ${f.service || "Iron work"}`)}&body=${encodeURIComponent(compose(f))}`;

  const field =
    "mt-2 block w-full rounded-card border bg-white/[0.03] px-4 py-3.5 text-[1rem] text-white placeholder:text-white/30 outline-none transition-[border-color,background-color,box-shadow] duration-300 focus:border-copper focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgb(180_127_87/0.18)]";
  const border = (bad: boolean) => (tried && bad ? "border-[#e0785b]" : "border-white/12");
  const label = "font-display text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-text-hi";

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className={label}>Your name *</span>
        <input
          className={cn(field, border(missing.name))}
          value={f.name}
          onChange={set("name")}
          autoComplete="name"
          aria-invalid={tried && missing.name}
          placeholder="e.g. Tunde"
        />
      </label>
      <label className="block">
        <span className={label}>Phone</span>
        <input
          className={cn(field, border(false))}
          value={f.phone}
          onChange={set("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="080..."
        />
      </label>
      <label className="block">
        <span className={label}>Service *</span>
        <select
          className={cn(field, border(missing.service), "appearance-none bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-10", !f.service && "text-white/40")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c38e6c' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
          value={f.service}
          onChange={set("service")}
          aria-invalid={tried && missing.service}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {site.services.map((s) => (
            <option key={s.slug} value={s.title} className="bg-base text-white">
              {s.title}
            </option>
          ))}
          <option value="Something else" className="bg-base text-white">
            Something else
          </option>
        </select>
      </label>
      <label className="block">
        <span className={label}>Location</span>
        <input
          className={cn(field, border(false))}
          value={f.area}
          onChange={set("area")}
          autoComplete="address-level2"
          placeholder="e.g. Ikeja, Ibadan, Abuja"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>What do you need? *</span>
        <textarea
          className={cn(field, border(missing.details), "min-h-[150px] resize-y")}
          value={f.details}
          onChange={set("details")}
          aria-invalid={tried && missing.details}
          placeholder="Sizes, how many, design, when you need it…"
        />
      </label>

      {tried && !valid && (
        <p role="alert" className="text-sm text-[#f0a189] sm:col-span-2">
          Please add your name, the service and a few details.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="group inline-flex h-14 items-center justify-center gap-3 rounded-card bg-copper-fill px-7 font-display text-base font-semibold uppercase tracking-[0.08em] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_12px_32px_-14px_rgb(180_127_87/0.7)] transition-colors duration-300 hover:bg-[#9c6239]"
        >
          <WhatsApp className="size-5" />
          Send on WhatsApp
          <ArrowRight className="size-5 transition-transform duration-300 ease-brand group-hover:translate-x-1" />
        </button>
        <a
          href={mailto}
          onClick={(e) => {
            if (!valid) {
              e.preventDefault();
              setTried(true);
            }
          }}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-card border border-white/15 px-6 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em] text-white/85 transition-colors hover:border-white/40 hover:text-white"
        >
          <Mail className="size-5" />
          Email instead
        </a>
      </div>
      <p className="text-[0.8125rem] text-steel sm:col-span-2">{site.contactPage.form.note}</p>
    </form>
  );
}
