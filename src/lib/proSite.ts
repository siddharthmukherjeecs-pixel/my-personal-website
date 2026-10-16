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

export const proSite = {
  name: "Siddharth Mukherjee",
  role: "AI/ML & AI Engineering (AIE) · Student Builder",
  tagline: "Bridging mathematical foundations, neural architectures, and intelligent systems. Focused on learning from first principles and building clean software.",
  email: "siddharthmukherjee.cs@gmail.com",
  phone: { label: "Bengaluru, India", href: "mailto:siddharthmukherjee.cs@gmail.com" },
  year: "2026",
  nav: [
    { label: "Overview", href: "/pro/#hero" },
    { label: "About", href: "/pro/#about" },
    { label: "Focus Areas", href: "/pro/#focus" },
    { label: "Principles", href: "/pro/#principles" },
    { label: "Milestones", href: "/pro/#milestones" },
    { label: "Contact", href: "/pro/#contact" }
  ],
  footerNav: [
    { label: "Focus", href: "/pro/#focus" },
    { label: "About", href: "/pro/#about" },
    { label: "Milestones", href: "/pro/#milestones" },
    { label: "Contact", href: "/pro/#contact" }
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/siddharthmukherjeecs-pixel" },
    { label: "Instagram", href: "https://www.instagram.com/siddharthmukherjee356?exln=MTZjZ2h1MDNmNHlt" },
    { label: "Email", href: "mailto:siddharthmukherjee.cs@gmail.com" }
  ],
  about: {
    statement: "Understanding intelligence from the ground up: mathematics, neural models, and applied code.",
    bio: "I’m Siddharth, a first-year undergraduate pursuing Artificial Intelligence & Machine Learning (AI/ML / AIE) in Bengaluru, India. I focus on understanding foundational machine learning models from first principles, experimenting with local LLM tooling, and developing clean, modern web interfaces.",
    contactLead: "For academic discussions, tech collabs, or project inquiries, reach out to",
    contactTail: "and let’s start a conversation."
  },
  awards: [
    { project: "B.Tech in AI/ML & AIE", award: "FIRST-YEAR UNDERGRAD", year: "2026", cover: "/assets/award-orbit.webp", alt: "University academic milestone" },
    { project: "Machine Learning Foundations", award: "CORE ARCHITECTURES", year: "2026", cover: "/assets/award-lumen.webp", alt: "Neural networks & math foundations" },
    { project: "AI Engineering & LLMs", award: "APPLIED EXPERIMENTATION", year: "2026", cover: "/assets/award-pace.webp", alt: "Local models and prompt orchestration" },
    { project: "Modern Web Systems", award: "RESPONSIVE FRONTEND", year: "2026", cover: "/assets/award-fauna.webp", alt: "TypeScript and Astro UI development" },
    { project: "Algorithmic Problem Solving", award: "DATA STRUCTURES", year: "2026", cover: "/assets/award-halo.webp", alt: "Algorithms and foundational compute" }
  ],
  principles: [
    { title: "Foundations before shortcuts", description: "Deep understanding of core mathematics and linear algebra matters more than shallow hype.", icon: "target", image: "/assets/principle-1.webp", alt: "Foundations" },
    { title: "Learn by building", description: "Theory clicks when you write the code, inspect the outputs, break things, and fix them.", icon: "sparkles", image: "/assets/principle-2.webp", alt: "Learning" },
    { title: "Simplicity and readability", description: "Simple architectures and clean code scale better and are easier to reason about.", icon: "smile", image: "/assets/principle-3.webp", alt: "Simplicity" },
    { title: "Curious and always exploring", description: "Technology evolves every day. Staying humble, observant, and eager to learn is the biggest advantage.", icon: "compass", image: "/assets/principle-4.webp", alt: "Curiosity" }
  ],
  ticker: "ARTIFICIAL INTELLIGENCE · MACHINE LEARNING · AI ENGINEERING · WEB ARCHITECTURE · BENGALURU",
  services: [
    { name: "AI & Machine Learning", image: "/assets/orbit-5.webp", alt: "Neural networks and machine learning", captions: ["Foundational Models", "Loss & Optimization", "Deep Learning Basics"] },
    { name: "AI Engineering (AIE)", image: "/assets/orbit-8.webp", alt: "Local models and applied AI", captions: ["Local LLM Tooling", "Prompt Engineering", "Agentic Pipelines"] },
    { name: "Web Development", image: "/assets/orbit-4.webp", alt: "Modern web architecture", captions: ["TypeScript & Astro", "Responsive Layouts", "Clean UI Systems"] },
    { name: "Developer Tooling", image: "/assets/orbit-3.webp", alt: "Version control and developer tools", captions: ["Git Version Control", "Linux & Shell", "Automation Scripts"] }
  ],
  gallery: {
    heading: "Every concept learned is a foundation built — ",
    headingMuted: "a stepping stone to mastery",
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
  },
  faq: [
    { q: "What is your primary academic focus?", a: "I am a first-year student pursuing a bachelor's degree in Artificial Intelligence & Machine Learning (AI/ML / AIE) in Bengaluru, India. My focus is on understanding neural computation, math foundations, and applied AI systems." },
    { q: "What technologies are you actively working with?", a: "Python for machine learning and scripting, local LLMs and prompt crafting for AI engineering, and HTML/CSS/TypeScript with Astro and modern frameworks for web applications." },
    { q: "Are you open to collaborative projects or hackathons?", a: "Yes! I love collaborating with fellow students, engineers, and researchers on interesting software projects, machine learning experiments, and hackathons." },
    { q: "How can I get in touch with you?", a: "You can email me directly at siddharthmukherjee.cs@gmail.com, connect with me on GitHub, or drop a message through the contact form below." }
  ],
  contact: {
    heading: "Open to technical conversations, collaborative projects, and opportunities",
    label: "GET IN TOUCH",
    text: "Feel free to reach out for project collaborations, technical discussions, or internship inquiries."
  },
  ring: ["/assets/ring-1.webp", "/assets/ring-2.webp", "/assets/ring-3.webp", "/assets/ring-4.webp", "/assets/ring-5.webp", "/assets/ring-6.webp", "/assets/ring-7.webp"]
};

export const proProjects: ProProject[] = [
  {
    id: "neural-foundations",
    title: "Neural Foundations",
    category: "AI / Machine Learning",
    order: 1,
    role: "Core ML Exploration",
    timeline: "Ongoing",
    year: "2026",
    overview: "Hands-on study and implementation of neural network layers, matrix operations, gradient descent algorithms, and loss optimization from scratch.",
    challenge: "Moving past high-level libraries to deeply understand backpropagation mathematics and numerical stability.",
    cover: "/assets/project-orbit-cover.webp",
    coverAlt: "Neural network visualization",
    showcase: "/assets/project-orbit-showcase.webp",
    showcaseAlt: "Neural computation architecture",
    heroImage: "/assets/hero-orbit.webp",
    heroAlt: "Mathematical visualization"
  },
  {
    id: "ai-engineering",
    title: "AI Engineering & LLMs",
    category: "AI Engineering",
    order: 2,
    role: "System Prototyping",
    timeline: "Ongoing",
    year: "2026",
    overview: "Practical exploration of local language model deployment, prompt architectures, agent workflows, and connecting AI capabilities into real applications.",
    challenge: "Balancing local compute constraints with latency and structured output consistency.",
    cover: "/assets/project-halo-cover.webp",
    coverAlt: "AI tooling interface",
    showcase: "/assets/project-halo-showcase.webp",
    showcaseAlt: "Agent workflow showcase",
    heroImage: "/assets/hero-halo.webp",
    heroAlt: "AI architecture hero"
  },
  {
    id: "dual-mode-portfolio",
    title: "Dual-Mode Portfolio",
    category: "Web Architecture",
    order: 3,
    role: "Full-Stack Web Dev",
    timeline: "2026",
    year: "2026",
    overview: "Architected a dual-personality portfolio featuring an expressive Material 3 digital garden alongside a high-performance minimalist editorial professional showcase.",
    challenge: "Isolating runtime styles and WebGL shader pipelines while enabling an effortless, unified toggle experience for visitors.",
    cover: "/assets/project-pace-cover.webp",
    coverAlt: "Portfolio interface",
    showcase: "/assets/project-pace-showcase.webp",
    showcaseAlt: "Web architecture showcase",
    heroImage: "/assets/hero-pace.webp",
    heroAlt: "Clean editorial layout"
  },
  {
    id: "algorithmic-lab",
    title: "Algorithmic Lab",
    category: "Computer Science",
    order: 4,
    role: "Data Structures & Algos",
    timeline: "Ongoing",
    year: "2026",
    overview: "Continuous practice and implementation of data structures, graph traversals, dynamic programming, and computational logic.",
    challenge: "Writing clean, optimized, time-complexity conscious solutions across diverse problem spaces.",
    cover: "/assets/project-lumen-cover.webp",
    coverAlt: "Algorithm visualization",
    showcase: "/assets/project-lumen-showcase.webp",
    showcaseAlt: "Algorithm execution graph",
    heroImage: "/assets/hero-lumen.webp",
    heroAlt: "Abstract compute"
  }
];

export function getProProjects(): ProProject[] {
  return [...proProjects].sort((a, b) => a.order - b.order);
}
