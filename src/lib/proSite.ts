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
  role: "1st Year Student · AI/ML & AIE · Tech Tinkerer",
  tagline: "First-year engineering student in Bengaluru, learning programming from the ground up. Tinkering with local LLMs via Ollama, exploring RAG concepts, and learning web dev.",
  email: "siddharthmukherjee.cs@gmail.com",
  phone: { label: "Bengaluru, India", href: "mailto:siddharthmukherjee.cs@gmail.com" },
  year: "2026",
  nav: [
    { label: "Overview", href: "/pro/#hero" },
    { label: "About", href: "/pro/#about" },
    { label: "What I'm Learning", href: "/pro/#focus" },
    { label: "Mindset", href: "/pro/#principles" },
    { label: "Journey", href: "/pro/#milestones" },
    { label: "Contact", href: "/pro/#contact" }
  ],
  footerNav: [
    { label: "Learning", href: "/pro/#focus" },
    { label: "About", href: "/pro/#about" },
    { label: "Journey", href: "/pro/#milestones" },
    { label: "Contact", href: "/pro/#contact" }
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/siddharthmukherjeecs-pixel" },
    { label: "Instagram", href: "https://www.instagram.com/siddharthmukherjee356?exln=MTZjZ2h1MDNmNHlt" },
    { label: "Email", href: "mailto:siddharthmukherjee.cs@gmail.com" }
  ],
  about: {
    statement: "A first-year student learning to code, tinkering with local LLMs, and curious about how AI actually works.",
    bio: "I’m Siddharth, a first-year undergraduate studying Artificial Intelligence & Machine Learning (AI/ML & AIE) in Bengaluru, India. I'm just getting started on my tech journey—learning Python programming, playing around with local LLMs using Ollama on my laptop, learning the basic concepts of RAG, and building websites with Astro and TypeScript along the way.",
    contactLead: "Always open to connecting, talking about tech, or learning together: reach out to",
    contactTail: "and say hi!"
  },
  awards: [
    { project: "B.Tech in AI/ML & AIE", award: "FIRST-YEAR UNDERGRAD", year: "2026", cover: "/assets/award-orbit.webp", alt: "Started my engineering journey in Bengaluru" },
    { project: "Tinkering with Ollama", award: "LOCAL LLM EXPERIMENTS", year: "2026", cover: "/assets/award-pace.webp", alt: "Running models locally on personal laptop" },
    { project: "Exploring RAG Concepts", award: "LEARNING RETRIEVAL", year: "2026", cover: "/assets/award-lumen.webp", alt: "Understanding vector search & document context" },
    { project: "Building This Website", award: "WEB DEV PRACTICE", year: "2026", cover: "/assets/award-fauna.webp", alt: "Learning Astro, HTML, CSS & TypeScript" },
    { project: "Python & Programming Basics", award: "LEARNING CODE", year: "2026", cover: "/assets/award-halo.webp", alt: "Practicing programming logic and scripts" }
  ],
  principles: [
    { title: "Curious above all", description: "I'm just starting out, so staying curious, asking questions, and exploring new tools is my top priority.", icon: "compass", image: "/assets/principle-4.webp", alt: "Curiosity" },
    { title: "Learn by breaking things", description: "Concepts make sense to me when I install the tool, run the code, see it break, and figure out why.", icon: "sparkles", image: "/assets/principle-2.webp", alt: "Learning" },
    { title: "Keep it simple", description: "As a beginner, writing clean and readable code is way better than trying to make it unnecessarily complex.", icon: "smile", image: "/assets/principle-3.webp", alt: "Simplicity" },
    { title: "Embrace being a beginner", description: "Tech moves super fast, especially in AI. Being honest about what I know and eager to learn the rest is how I grow.", icon: "target", image: "/assets/principle-1.webp", alt: "Foundations" }
  ],
  ticker: "1ST YEAR STUDENT · AI/ML & AIE · OLLAMA · RAG CONCEPTS · PYTHON · BENGALURU, INDIA · 2026",
  services: [
    { name: "Local LLMs & Ollama", image: "/assets/orbit-8.webp", alt: "Running models locally with Ollama", captions: ["Running Models on Laptop", "Testing System Prompts", "Exploring Open Weights"] },
    { name: "RAG & Retrieval Concepts", image: "/assets/orbit-5.webp", alt: "Learning retrieval augmented generation", captions: ["Learning Vector Search", "Reading Custom Docs", "Reducing Hallucinations"] },
    { name: "Beginner Web Dev", image: "/assets/orbit-4.webp", alt: "Learning modern web development", captions: ["HTML & CSS Basics", "TypeScript & Astro", "Building Responsive Pages"] },
    { name: "Python & Coding Basics", image: "/assets/orbit-3.webp", alt: "Python programming practice", captions: ["Python Fundamentals", "Simple Automation Scripts", "Problem Solving Practice"] }
  ],
  gallery: {
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
  },
  faq: [
    { q: "What are you currently studying?", a: "I am a first-year undergraduate student pursuing Artificial Intelligence & Machine Learning (AI/ML & AIE) in Bengaluru, India." },
    { q: "What have you experimented with so far?", a: "As a beginner, I like tinkering hands-on. I've set up Ollama to test running local LLMs on my laptop, read and learned about how RAG works to ground models with custom documents, and built this website using Astro to learn web development." },
    { q: "What are your goals right now?", a: "My goal is to build strong programming fundamentals in Python and computer science, keep experimenting with AI tools, and collaborate on beginner-friendly projects or college hackathons." },
    { q: "How can someone reach you?", a: "Feel free to email me at siddharthmukherjee.cs@gmail.com or connect with me on GitHub. I'm always happy to talk tech and learn from others!" }
  ],
  contact: {
    heading: "Open to conversations, learning together, and student collaborations",
    label: "GET IN TOUCH",
    text: "Feel free to reach out for student projects, hackathons, technical discussions, or just to say hi."
  },
  ring: ["/assets/ring-1.webp", "/assets/ring-2.webp", "/assets/ring-3.webp", "/assets/ring-4.webp", "/assets/ring-5.webp", "/assets/ring-6.webp", "/assets/ring-7.webp"]
};

export const proProjects: ProProject[] = [
  {
    id: "local-llms-ollama",
    title: "Testing Local LLMs with Ollama",
    category: "AI Tinkering · Local Compute",
    order: 1,
    role: "Personal Exploration",
    timeline: "Ongoing",
    year: "2026",
    overview: "Set up Ollama on my own machine to experiment with running open-source models (like Llama and Mistral) locally. Wanted to see firsthand how prompts work, how fast models respond on my laptop, and what running AI locally feels like.",
    challenge: "Understanding hardware limits and seeing how system prompts guide model responses.",
    cover: "/assets/project-orbit-cover.webp",
    coverAlt: "Local LLM runtime visualization",
    showcase: "/assets/project-orbit-showcase.webp",
    showcaseAlt: "Ollama inference showcase",
    heroImage: "/assets/hero-orbit.webp",
    heroAlt: "Compute architecture hero"
  },
  {
    id: "rag-concepts",
    title: "Learning RAG Concepts",
    category: "AI Exploration · Self-Study",
    order: 2,
    role: "Learning & Practice",
    timeline: "Ongoing",
    year: "2026",
    overview: "Started learning about the concept of Retrieval-Augmented Generation (RAG)—how vector embeddings and text chunking allow an LLM to look up information from local documents or notes before answering questions, reducing hallucinations.",
    challenge: "Learning how text gets turned into vector numbers and how similarity search finds the right passages.",
    cover: "/assets/project-halo-cover.webp",
    coverAlt: "RAG architecture diagram",
    showcase: "/assets/project-halo-showcase.webp",
    showcaseAlt: "Vector retrieval pipeline showcase",
    heroImage: "/assets/hero-halo.webp",
    heroAlt: "Retrieval augmented generation hero"
  },
  {
    id: "building-this-website",
    title: "Building This Website",
    category: "Web Dev · Astro & TypeScript",
    order: 3,
    role: "Hands-on Project",
    timeline: "2026",
    year: "2026",
    overview: "Built my personal website using Astro to learn modern web development. Created both a fun casual digital garden and a clean professional portfolio page to practice components, styling, and Git version control.",
    challenge: "Learning how Astro components work, managing layouts, and getting comfortable with Git commits and pushes.",
    cover: "/assets/project-pace-cover.webp",
    coverAlt: "Portfolio interface showcase",
    showcase: "/assets/project-pace-showcase.webp",
    showcaseAlt: "Web architecture showcase",
    heroImage: "/assets/hero-pace.webp",
    heroAlt: "Clean editorial layout hero"
  },
  {
    id: "python-basics",
    title: "Python Foundations & Scripts",
    category: "Programming · First-Year Basics",
    order: 4,
    role: "Learning & Practice",
    timeline: "Ongoing",
    year: "2026",
    overview: "Practicing basic programming logic, loops, functions, and simple data structures in Python. Writing small scripts to automate everyday tasks and building a solid foundation for upcoming college coursework.",
    challenge: "Building programming logic and learning how to debug errors step by step.",
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
