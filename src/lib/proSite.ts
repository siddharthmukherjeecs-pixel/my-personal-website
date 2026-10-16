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
    { src: "/assets/orbit-1.webp", alt: "Ollama CLI session running Llama 3.2 locally" },
    { src: "/assets/orbit-2.webp", alt: "RAG vector embeddings and semantic search architecture diagram" },
    { src: "/assets/orbit-3.webp", alt: "Python numpy array and cosine similarity script" },
    { src: "/assets/orbit-4.webp", alt: "VS Code editor with Astro component architecture" },
    { src: "/assets/orbit-5.webp", alt: "Vector database embeddings cluster and query match" },
    { src: "/assets/orbit-6.webp", alt: "Bengaluru tech hub skyline illuminated at twilight" },
    { src: "/assets/orbit-7.webp", alt: "Apple Magic Keyboard on clean study desk" },
    { src: "/assets/orbit-8.webp", alt: "Ollama multi-model quantization inspection" },
    { src: "/assets/orbit-9.webp", alt: "Linear algebra and matrix mathematics on chalkboard" },
    { src: "/assets/orbit-10.webp", alt: "Late-night engineering study desk with laptop and coffee" },
    { src: "/assets/orbit-11.webp", alt: "Git version control terminal workflow on main branch" },
    { src: "/assets/orbit-12.webp", alt: "Engineering college library and study space" }
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
