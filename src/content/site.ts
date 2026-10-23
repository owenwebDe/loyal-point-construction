// Every word on the site lives here.
// Business data is from the client; the site wording was approved by the client on 2026-10-23.

export type IconName =
  | "burglary"
  | "door"
  | "window"
  | "container"
  | "repair"
  | "bend"
  | "column"
  | "beam"
  | "deck"
  | "grid"
  | "phone"
  | "pin"
  | "arch"
  | "clock";

const phone = (local: string) => {
  const intl = `234${local.slice(1)}`;
  return { display: local, tel: `+${intl}`, wa: `https://wa.me/${intl}` };
};

export type Service = {
  slug: string;
  title: string;
  /** Longer name for headings and page titles. */
  name: string;
  /** One line, shown in lists and the page hero. */
  short: string;
  note?: string;
  icon: IconName;
};

const services: Service[] = [
  { slug: "iron-burglary", title: "Iron Burglary", name: "Iron Burglary Proof", short: "Iron burglary proof for windows and doors, made to fit the opening.", icon: "burglary" },
  { slug: "safety-doors", title: "Safety Doors", name: "Steel Safety Doors", short: "Steel safety doors with embossed panels, single or double, finished in gloss.", icon: "door" },
  { slug: "windows", title: "Windows", name: "Windows", note: "Various Designs", short: "Steel windows in various designs.", icon: "window" },
  { slug: "containers", title: "Containers", name: "Container Work", short: "Steel container work, fabricated in the workshop.", icon: "container" },
  { slug: "general-repairs", title: "General Repairs", name: "General Repairs", short: "Repairs to doors, gates, burglary proof and other iron work.", icon: "repair" },
  { slug: "iron-bending", title: "Iron Bending", name: "Iron Bending", short: "Iron rods cut and bent to shape for building work.", icon: "bend" },
  { slug: "pillars-columns", title: "Pillars & Columns", name: "Pillars & Columns", short: "Iron work for pillars and columns.", icon: "column" },
  { slug: "beams", title: "Beams", name: "Beams", short: "Iron work for beams.", icon: "beam" },
  { slug: "decking", title: "Decking", name: "Decking", short: "Iron work for decking.", icon: "deck" },
];

export const site = {
  name: "Loyal Point Construction",
  /** Wording on the client's badge. */
  trade: "Welding and Fabrication",
  title: "Loyal Point Construction | Iron Works & Fabrication, Ketu, Lagos",
  description: "Iron works, safety doors, windows and fabrication in Ketu, Lagos.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  phones: [phone("07030330791"), phone("08024464209")],
  email: "loyalpointconstruction@gmail.com",
  // From the client, 2026-10-22: "open 24 hours" (every day).
  hours: { label: "Open 24 hours", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  address: {
    street: "8, Oladega Street, off Segun Salau Street",
    landmark: "Iyana School bus stop",
    locality: "Ketu",
    region: "Lagos State",
    country: "NG",
  },
  social: {
    instagram: { handle: "@gboladega", url: "https://www.instagram.com/gboladega/" },
    telegram: { handle: "@LPConstruction", url: "https://t.me/LPConstruction" },
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  quoteHref: "/contact#quote",

  services,

  home: {
    hero: {
      lines: ["Built Strong.", "Built to Last."],
      sub: "Iron works, safety doors, windows and fabrication in Ketu, Lagos.",
      primary: { label: "Our Services", href: "/services" },
      secondary: { label: "View Our Work", href: "/projects" },
    },
    services: { eyebrow: "Our Services", title: ["Nine services.", "One call away."] },
    build: { eyebrow: "What We Build", title: ["Made in Ketu.", "Built for Lagos."] },
    process: {
      eyebrow: "How We Work",
      title: ["From raw steel", "to finished work."],
      steps: [
        { key: "measure", title: "Measure", text: "Steel is measured and marked." },
        { key: "cut", title: "Cut", text: "Each length is cut to size." },
        { key: "bend", title: "Bend", text: "Rods and bars are bent to shape." },
        { key: "weld", title: "Weld", text: "Every joint is welded into one solid piece." },
        { key: "finish", title: "Finish", text: "Painted to a deep, glossy finish." },
      ],
    },
    featured: {
      eyebrow: "Featured Work",
      title: ["Proof in", "the metal."],
      cta: { label: "View All Projects", href: "/projects" },
    },
  },

  servicesPage: {
    eyebrow: "Services",
    title: ["Nine services.", "One workshop."],
    sub: "Everything we make and fix, from safety doors to the iron work inside your building.",
    noPhotos: (service: string) =>
      `Photos of recent ${service.toLowerCase()} jobs are on the way. Ask on WhatsApp and we'll send you pictures.`,
  },

  projectsPage: {
    eyebrow: "Projects",
    title: ["Straight from", "the workshop."],
    sub: "Doors, frames and iron work from the Loyal Point workshop. Tap any photo to see it up close.",
  },

  aboutPage: {
    eyebrow: "About",
    title: ["Made in Ketu.", "Built for Lagos."],
    sub: "Loyal Point Construction is a welding and fabrication workshop in Ketu, Lagos, open 24 hours.",
    workshop: {
      eyebrow: "The Workshop",
      title: ["Where the", "work happens."],
      text: [
        "Every door, frame and grille starts here, in our workshop at 8, Oladega Street, off Segun Salau Street, near Iyana School bus stop in Ketu.",
        "We're open 24 hours. Call before you come, or just stop by.",
      ],
      caption: "The workshop in Ketu. Yes, that's our number on the wall.",
    },
    directions: {
      eyebrow: "Find Us",
      title: ["Iyana School", "bus stop, Ketu."],
      steps: [
        "Get to Iyana School bus stop in Ketu.",
        "Turn into Segun Salau Street.",
        "Oladega Street is off Segun Salau. We're at number 8.",
      ],
    },
  },

  contactPage: {
    eyebrow: "Contact",
    title: ["Let's talk", "about your job."],
    sub: "Open 24 hours. Call, WhatsApp or visit the workshop in Ketu.",
    form: {
      eyebrow: "Request a Quote",
      title: ["Tell us what", "you need."],
      note: "Your request opens in WhatsApp, ready to send. Nothing is stored on this website.",
    },
  },

  facts: {
    eyebrow: "At a glance",
    title: ["Loyal Point", "Construction"],
    items: [
      { value: 9, label: "Services", icon: "grid" },
      { value: 24, label: "Hours Open", icon: "clock" },
      { value: "Ketu", label: "Lagos", icon: "pin" },
      { value: "Custom", label: "Window Designs", icon: "arch" },
    ] satisfies { value: number | string; label: string; icon: IconName }[],
  },

  cta: {
    title: "Ready to build? Let's talk.",
    sub: "Open 24 hours. Call or WhatsApp 07030330791 or 08024464209.",
    call: "Call Us",
    whatsapp: "WhatsApp Us",
  },

  footer: {
    blurb: "Iron works, safety doors, windows and fabrication in Ketu, Lagos.",
  },

  // Pre-filled WhatsApp text for the quote buttons.
  quoteMessage: "Hello Loyal Point Construction, I'd like a quote.",
  serviceMessage: (service: string) => `Hello Loyal Point Construction, I'd like a quote for ${service}.`,
} as const;

export const primaryPhone = site.phones[0];

export const waLink = (text?: string, number = primaryPhone) =>
  text ? `${number.wa}?text=${encodeURIComponent(text)}` : number.wa;

export const fullAddress = [
  site.address.street,
  site.address.landmark,
  site.address.locality,
  site.address.region,
].join(", ");

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "8 Oladega Street, Ketu, Lagos, Nigeria",
)}`;

export const serviceBySlug = (slug: string) => site.services.find((s) => s.slug === slug);
