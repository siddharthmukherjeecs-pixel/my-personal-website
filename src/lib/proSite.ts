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
  tagline: "First-year AI/ML & AIE student in Bengaluru. Tinkering with local LLMs via Ollama, exploring RAG architectures, and crafting modern web software.",
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
    statement: "Building intuition from first principles: local model runtimes, retrieval pipelines, and clean code.",
    bio: "I’m Siddharth, a first-year student pursuing Artificial Intelligence & Machine Learning (AI/ML & AIE) in Bengaluru, India. I enjoy getting my hands dirty with tech: running open-weights LLMs locally using Ollama, learning how RAG grounds language models with vector retrieval, and building clean web systems with Astro and TypeScript.",
    contactLead: "For academic discussions, tech collabs, or student projects, reach out to",
    contactTail: "and let’s start a conversation."
  },
  awards: [
    { project: "B.Tech in AI/ML & AIE", award: "FIRST-YEAR UNDERGRAD", year: "2026", cover: "/assets/award-orbit.webp", alt: "University academic milestone in Bengaluru" },
    { project: "Local LLM Inference", award: "OLLAMA & OPEN WEIGHTS", year: "2026", cover: "/assets/award-pace.webp", alt: "Local models running without cloud APIs" },
    { project: "RAG & Knowledge Retrieval", award: "EMBEDDINGS & GROUNDING", year: "2026", cover: "/assets/award-lumen.webp", alt: "Vector embeddings and semantic search" },
    { project: "Dual-Mode Web Engineering", award: "ASTRO & TYPESCRIPT", year: "2026", cover: "/assets/award-fauna.webp", alt: "Dual-architecture high-performance portfolio" },
    { project: "Python & Core Compute", award: "CODE & SCRIPTING", year: "2026", cover: "/assets/award-halo.webp", alt: "Algorithmic logic and automation scripts" }
  ],
  principles: [
    { title: "First principles before shortcuts", description: "Deep understanding of core mathematics and linear algebra matters more than shallow hype.", icon: "target", image: "/assets/principle-1.webp", alt: "Foundations" },
    { title: "Learn by building", description: "Theory clicks when you write the code, inspect the outputs, break things, and fix them.", icon: "sparkles", image: "/assets/principle-2.webp", alt: "Learning" },
    { title: "Simplicity and readability", description: "Simple architectures and clean code scale better and are easier to reason about.", icon: "smile", image: "/assets/principle-3.webp", alt: "Simplicity" },
    { title: "Curious and always exploring", description: "Technology evolves every day. Staying humble, observant, and eager to learn is the biggest advantage.", icon: "compass", image: "/assets/principle-4.webp", alt: "Curiosity" }
  ],
  ticker: "LOCAL LLMS · OLLAMA · RAG PIPELINES · AI ENGINEERING · PYTHON · BENGALURU, INDIA · 2026",
  services: [
    { name: "Local LLMs & Ollama", image: "/assets/orbit-8.webp", alt: "Local LLM runtimes with Ollama", captions: ["Quantized Open Weights", "Ollama Local Runtimes", "System Prompt Engineering"] },
    { name: "RAG & Semantic Retrieval", image: "/assets/orbit-5.webp", alt: "Retrieval augmented generation", captions: ["Vector Embeddings", "Document Chunking", "Context Grounding & Search"] },
    { name: "Web Architecture & TypeScript", image: "/assets/orbit-4.webp", alt: "Modern web architecture with Astro", captions: ["Astro Components", "Responsive Modern UI", "Performance & Clean Code"] },
    { name: "AI/ML Foundations & Python", image: "/assets/orbit-3.webp", alt: "Python scripting and foundational ML", captions: ["Mathematical Intuition", "Python Scripting", "Algorithmic Problem Solving"] }
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
    { q: "What have you built or experimented with in AI?", a: "I actively experiment with running local LLMs (like Llama, Mistral, and Qwen) on my own machine using Ollama. I've also been exploring Retrieval-Augmented Generation (RAG)—learning how embeddings, vector search, and document chunking work to feed relevant context to language models and reduce hallucinations." },
    { q: "What is your current academic status?", a: "I am in my first year of undergraduate studies, specializing in Artificial Intelligence & Machine Learning (AI/ML & AIE) in Bengaluru, India." },
    { q: "What technologies and languages do you work with?", a: "Python for scripting and data exploration, Ollama for local LLM inference, and HTML/CSS/TypeScript with Astro and modern frameworks for web development." },
    { q: "Are you open to collaborations or student projects?", a: "Yes! I’m always keen to connect, collaborate on student hackathons, or chat about local LLMs, AI engineering, and web development." }
  ],
  contact: {
    heading: "Open to technical conversations, collaborative projects, and opportunities",
    label: "GET IN TOUCH",
    text: "Feel free to reach out for student collaborations, hackathons, technical discussions, or internship inquiries."
  },
  ring: ["/assets/ring-1.webp", "/assets/ring-2.webp", "/assets/ring-3.webp", "/assets/ring-4.webp", "/assets/ring-5.webp", "/assets/ring-6.webp", "/assets/ring-7.webp"]
};

export const proProjects: ProProject[] = [
  {
    id: "local-llms-ollama",
    title: "Local LLMs with Ollama",
    category: "AI Engineering · Local Inference",
    order: 1,
    role: "Local Compute & Runtimes",
    timeline: "Ongoing",
    year: "2026",
    overview: "Hands-on exploration running quantized open-source language models (Llama, Mistral, Qwen) completely locally with Ollama. Experimenting with context windows, system prompts, and latency benchmarks directly on consumer hardware without external cloud APIs.",
    challenge: "Balancing local compute constraints with response speed, and crafting resilient system prompts to achieve consistent reasoning outputs.",
    cover: "/assets/project-orbit-cover.webp",
    coverAlt: "Local LLM runtime visualization",
    showcase: "/assets/project-orbit-showcase.webp",
    showcaseAlt: "Ollama inference showcase",
    heroImage: "/assets/hero-orbit.webp",
    heroAlt: "Compute architecture hero"
  },
  {
    id: "rag-architecture",
    title: "RAG Pipeline & Retrieval",
    category: "AI Engineering · Knowledge Grounding",
    order: 2,
    role: "Architecture & Concept Study",
    timeline: "Ongoing",
    year: "2026",
    overview: "Studying Retrieval-Augmented Generation (RAG) from the ground up: document chunking strategies, vector embeddings, similarity search, and injecting grounded domain context into LLM generation prompts to prevent hallucinations.",
    challenge: "Understanding chunk boundary trade-offs, embedding dimensionality, and retrieval relevance vs context window token budgets.",
    cover: "/assets/project-halo-cover.webp",
    coverAlt: "RAG architecture diagram",
    showcase: "/assets/project-halo-showcase.webp",
    showcaseAlt: "Vector retrieval pipeline showcase",
    heroImage: "/assets/hero-halo.webp",
    heroAlt: "Retrieval augmented generation hero"
  },
  {
    id: "dual-mode-portfolio",
    title: "Dual-Architecture Portfolio",
    category: "Web Engineering · TypeScript & Astro",
    order: 3,
    role: "Frontend Architecture",
    timeline: "2026",
    year: "2026",
    overview: "Engineered a dual-mode web experience pairing an expressive Material 3 digital garden with an ultra-fast, minimalist WebGL editorial showcase. Features native client-side routing, WebGL canvas shaders, and zero-conflict CSS design tokens.",
    challenge: "Harmonizing isolated runtime dependencies, Lenis smooth scrolling, and dynamic layout switchers across dual design systems.",
    cover: "/assets/project-pace-cover.webp",
    coverAlt: "Portfolio interface showcase",
    showcase: "/assets/project-pace-showcase.webp",
    showcaseAlt: "Web architecture showcase",
    heroImage: "/assets/hero-pace.webp",
    heroAlt: "Clean editorial layout hero"
  },
  {
    id: "aiml-foundations",
    title: "AI/ML Foundations & Python",
    category: "Computer Science · Python",
    order: 4,
    role: "First-Year Undergrad Study",
    timeline: "Ongoing",
    year: "2026",
    overview: "Deep diving into first-year computer science fundamentals: linear algebra, gradient descent intuition, neural computation principles, and writing practical Python scripts for automation and data experiments.",
    challenge: "Bridging theoretical mathematical formulations with clean, executable, testable code implementations.",
    cover: "/assets/project-lumen-cover.webp",
    coverAlt: "Algorithmic computation",
    showcase: "/assets/project-lumen-showcase.webp",
    showcaseAlt: "Python data workflow graph",
    heroImage: "/assets/hero-lumen.webp",
    heroAlt: "Abstract compute hero"
  }
];

export function getProProjects(): ProProject[] {
  return [...proProjects].sort((a, b) => a.order - b.order);
}
