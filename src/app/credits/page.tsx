import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/content/site";
import { workItems } from "@/lib/work";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Credits for the sample photos used on this site.",
  alternates: { canonical: "/credits" },
  robots: { index: false },
};

const labels: Record<string, string> = Object.fromEntries(site.services.map((s) => [s.slug, s.title]));

export default function CreditsPage() {
  const samples = workItems.filter((i) => i.source === "placeholder" && i.credit);
  return (
    <>
      <PageHero
        eyebrow="Photo Credits"
        title={["Photo", "credits."]}
        sub="Photos marked “Sample photo” show typical Nigerian site and workshop work while Loyal Point's own photos of these services are added. They are not Loyal Point jobs. Every other photo on this site is Loyal Point's own work."
        size="compact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Photo Credits" }]}
      />
      <section aria-label="Sample photo credits" className="bg-ink pb-24 pt-6 lg:pb-32">
        <div className="container-x">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {samples.map((item) => {
              const c = item.credit!;
              return (
                <li key={item.id} className="flex items-center gap-5 py-5">
                  <span className="relative block size-16 shrink-0 overflow-hidden rounded-card bg-surface">
                    <Image src={item.src} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="min-w-0 text-[0.9375rem] leading-relaxed text-text-hi">
                    <span className="eyebrow mb-1 block text-[0.6875rem] text-copper">{labels[item.category] ?? "Sample"}</span>
                    <a href={c.source} target="_blank" rel="noopener" className="text-white underline-offset-4 hover:underline">
                      {c.title.replace(/\.[^.]+$/, "")}
                    </a>{" "}
                    by {c.author}, via Wikimedia Commons.{" "}
                    {c.licenseUrl ? (
                      <a href={c.licenseUrl} target="_blank" rel="noopener" className="text-copper-hi underline-offset-4 hover:underline">
                        {c.license}
                      </a>
                    ) : (
                      c.license
                    )}
                    . Changes: {c.changes}.
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
