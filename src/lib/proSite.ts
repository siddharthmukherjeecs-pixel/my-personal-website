import proSiteRaw from "@/data/proSite.json";

export interface ProProject {
  id: string;
  title: string;
  category: string;
  order: number;
  role: string;
  timeline: string;
  year: string;
  overview: string;
  challenge: string;
  cover: string;
  coverAlt: string;
  showcase: string;
  showcaseAlt: string;
  heroImage: string;
  heroAlt: string;
}

export interface ProPrinciple {
  title: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
}

export interface ProService {
  name: string;
  image: string;
  alt: string;
  captions: string[];
}

export interface ProAward {
  project: string;
  award: string;
  year: string;
  cover: string;
  alt: string;
}

export interface ProFAQ {
  q: string;
  a: string;
}

const defaultNav = [
  { label: "Overview", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "What I'm Learning", href: "/#focus" },
  { label: "Mindset", href: "/#principles" },
  { label: "Journey", href: "/#milestones" },
  { label: "Contact", href: "/#contact" }
];

const defaultFooterNav = [
  { label: "Learning", href: "/#focus" },
  { label: "About", href: "/#about" },
  { label: "Journey", href: "/#milestones" },
  { label: "Contact", href: "/#contact" }
];

const defaultSocials = [
  { label: "GitHub", href: "https://github.com/siddharthmukherjeecs-pixel" },
  { label: "Instagram", href: "https://www.instagram.com/siddharthmukherjee356?exln=MTZjZ2h1MDNmNHlt" },
  { label: "Email", href: "mailto:siddharthmukherjee.cs@gmail.com" }
];

const defaultGallery = {
  heading: "Every small experiment is a step forward — ",
  headingMuted: "learning by building every day",
  images: [
    { src: "/assets/orbit-1.webp", alt: "Visual sample 1" },
    { src: "/assets/orbit-2.webp", alt: "Visual sample 2" },
    { src: "/assets/orbit-3.webp", alt: "Visual sample 3" },
    { src: "/assets/orbit-4.webp", alt: "Visual sample 4" },
    { src: "/assets/orbit-5.webp", alt: "Visual sample 5" },
    { src: "/assets/orbit-6.webp", alt: "Visual sample 6" },
    { src: "/assets/orbit-7.webp", alt: "Visual sample 7" },
    { src: "/assets/orbit-8.webp", alt: "Visual sample 8" },
    { src: "/assets/orbit-9.webp", alt: "Visual sample 9" },
    { src: "/assets/orbit-10.webp", alt: "Visual sample 10" },
    { src: "/assets/orbit-11.webp", alt: "Visual sample 11" },
    { src: "/assets/orbit-12.webp", alt: "Visual sample 12" }
  ]
};

const defaultRing = [
  "/assets/ring-1.webp",
  "/assets/ring-2.webp",
  "/assets/ring-3.webp",
  "/assets/ring-4.webp",
  "/assets/ring-5.webp",
  "/assets/ring-6.webp",
  "/assets/ring-7.webp"
];

export const proSite = {
  name: proSiteRaw.name || "Siddharth Mukherjee",
  role: proSiteRaw.role || "1st Year Student · AI/ML & AIE · Tech Tinkerer",
  tagline: proSiteRaw.tagline || "",
  email: proSiteRaw.email || "siddharthmukherjee.cs@gmail.com",
  phone: {
    label: proSiteRaw.phoneLabel || "Bengaluru, India",
    href: `mailto:${proSiteRaw.email || "siddharthmukherjee.cs@gmail.com"}`
  },
  year: proSiteRaw.year || "2026",
  nav: defaultNav,
  footerNav: defaultFooterNav,
  socials: defaultSocials,
  about: {
    statement: proSiteRaw.about?.statement || "",
    bio: proSiteRaw.about?.bio || "",
    portrait: proSiteRaw.about?.portrait || "/assets/siddharth-portrait.webp",
    contactLead: proSiteRaw.about?.contactLead || "Always open to connecting, talking about tech, or learning together: reach out to",
    contactTail: proSiteRaw.about?.contactTail || "and say hi!"
  },
  contact: {
    heading: proSiteRaw.contact?.heading || "Open to conversations, learning together, and student collaborations",
    label: proSiteRaw.contact?.label || "GET IN TOUCH",
    text: proSiteRaw.contact?.text || "",
    avatar: proSiteRaw.contact?.avatar || "/assets/siddharth-avatar.webp"
  },
  awards: (proSiteRaw.awards || []) as ProAward[],
  principles: (proSiteRaw.principles || []) as ProPrinciple[],
  ticker: proSiteRaw.ticker || "1ST YEAR STUDENT · AI/ML & AIE · OLLAMA · RAG CONCEPTS · PYTHON · BENGALURU, INDIA · 2026",
  services: (proSiteRaw.services || []) as ProService[],
  gallery: defaultGallery,
  faq: (proSiteRaw.faq || []) as ProFAQ[],
  ring: defaultRing
};

export const proProjects: ProProject[] = (proSiteRaw.projects || []) as ProProject[];

export function getProProjects(): ProProject[] {
  return [...proProjects].sort((a, b) => a.order - b.order);
}
