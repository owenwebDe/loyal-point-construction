import manifest from "@/data/work.json";

export type WorkItem = {
  id: string;
  file: string;
  source: "client" | "placeholder";
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  category: string;
  alt: string;
  credit?: { title: string; author: string; license: string; licenseUrl: string; source: string; changes: string };
};

export const workItems = manifest.items as WorkItem[];

const byId = new Map(workItems.map((item) => [item.id, item]));

export const featuredWork = manifest.featured
  .map((f) => ({ ...f, item: byId.get(f.id) }))
  .filter((f): f is { id: string; title: string; item: WorkItem } => Boolean(f.item));

/** A category's photos, the client's own first (so covers and lightboxes lead with real work). */
export const itemsInCategory = (category: string) =>
  workItems
    .filter((item) => item.category === category)
    .sort((a, b) => Number(b.source === "client") - Number(a.source === "client"));

/** The client's own photos only. */
export const clientPhotos = (category: string) =>
  workItems.filter((item) => item.category === category && item.source === "client");

/** Round-robin across categories so the "All" gallery view mixes subjects. */
export function interleaved(items: WorkItem[] = workItems) {
  const groups = new Map<string, WorkItem[]>();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category)!.push(item);
  }
  const queues = [...groups.values()];
  const out: WorkItem[] = [];
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
    }
  }
  return out;
}

/** Gallery order: the client's real work first, then any remaining samples. */
export const galleryOrder = [
  ...interleaved(workItems.filter((i) => i.source === "client")),
  ...interleaved(workItems.filter((i) => i.source !== "client")),
];
