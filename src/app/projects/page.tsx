import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/ui/PageHero";
import { broll } from "@/content/media";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Safety doors, burglary proof, windows and iron work by Loyal Point Construction, Lagos and across Nigeria.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const { eyebrow, title, sub } = site.projectsPage;
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        background={broll.grinder}
        size="compact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <Gallery />
      <Cta />
    </>
  );
}
