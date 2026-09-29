export const assetPathPrefix = "/assets";

export const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "programming", label: "Programming" },
  { id: "photography", label: "Photography" },
  { id: "design", label: "Design & UX" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  labels: (keyof typeof projectLabelDefinitions)[];
  description: string;
  year: string | null;
  details: string[];
  screenshots: string[] | null;
  videoUrl: string | null;
  github: string | null;
}

export const projectLabelDefinitions = {
  university: {
    label: "University",
    tone: "universityBlue",
  },

  archived: {
    label: "Archived",
    tone: "muted",
  },

  active: {
    label: "Active",
    tone: "lime",
  },

  inDevelopment: {
    label: "In development",
    tone: "inDevelopment",
  },

  personal: {
    label: "Personal",
    tone: "coral",
  },

  si: {
    label: "Summer Internship",
    tone: "sky",
  },
} as const;

export const projects: Project[] = [
  {
    slug: "personal-website",
    title: "Personal website",
    subtitle: "Photography and CS Portfolio",

    tags: ["TypeScript", "React", "Astro"],
    labels: ["personal", "active"],

    description:
      "You are currently looking at it 😄! A website for showcasing my portfolio; both for code projects and photography work.",

    year: "2026",

    details: [
      "I wanted to try to design and develop a personal portfolio website.",
      "The purpose is to showcase photography, programming projects, and design work.",
      "Currently working on deployment and further improvements (store images in AWS??).",
    ],

    screenshots: ["/public/assets/images/thisWebsite.png"],
    videoUrl: null,
    github: null,
  },

  {
    slug: "skatteetaten-summer-internship",
    title: "Skatteetaten Summer Internship",
    subtitle: "Fullstack Developer · Summer 2025",

    tags: ["React", "Java", "SQL"],
    labels: ["si"],

    description:
      "Summer job as Fullstack Developer @ Skatteetaten, the summer of 2025.",

    year: "2025",

    details: [
      "Developed functionality for the SISMO debt collection portal.",
      "Worked with React and TypeScript in the frontend.",
      "Java and SQL in the backend.",
      "Collaborated with designers and other developers throughout the project.",
    ],

    screenshots: ["/public/assets/images/skatteetaten.png"],
    videoUrl: null,
    github: null,
  },

  {
    slug: "icebreaker",
    title: "Icebreaker | TDT4140",
    subtitle: "Software Engineering · University Project",

    tags: ["React", "Tailwind", "Java"],
    labels: ["university", "archived"],

    description:
      "A collaborative team project, from the course TDT4140 Software Engineering.",

    year: "2024",

    details: [
      "Developed as part of the TDT4140 Software Engineering course.",
      "Worked collaboratively as part of a student development team.",
      "Built a web-based application using React and Tailwind.",
      "Implemented backend functionality using Java.",
    ],

    screenshots: null,
    videoUrl: null,
    github: null,
  },

  {
    slug: "codetrotter",
    title: "CodeTrotter | TDT4195",
    subtitle: "Graphics and Visualisation · University Project",

    tags: ["C++", "C"],
    labels: ["university", "archived"],

    description:
      "Visualizes the Earth's rotation and allows users to explore its surface, including the transition between night and day.",

    year: "2024",

    details: [
      "Developed as part of the TDT4195 Graphics and Visualisation course.",
      "Created an interactive 3D visualization of the Earth.",
      "Implemented graphics and interaction using C++ and C.",
      "Explored real-time rendering and interactive 3D environments.",
    ],

    screenshots: null,
    videoUrl: "https://youtube.com/embed/weKFIjwk46M",
    github: null,
  },
];
