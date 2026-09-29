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

export const projects = [
  {
    name: "Personal Website",
    description:
      "You are currently looking at it 😄! A website for showcasing my portfolio; both for code projects and photography work.",
    tags: ["Typescript", "React", "Astro"],
    labels: ["personal", "active"],
    year: "2026",
  },
  {
    name: "Skatteetaten Summer Internship",
    description:
      "Summer job as Fullstack Developer @ Skatteetaten, the summer of 2025",
    tags: ["React", "Java", "SQL"],
    labels: ["si"],
    year: "2025",
  },
  {
    name: "Icebreaker | TDT4140",
    description:
      "A collaborative team project, from the course TDT4140 Software Engineering.",
    tags: ["React", "Tailwind", "Java"],
    labels: ["university", "archived"],
    year: "2024",
  },
  {
    name: "CodeTrotter | TDT4195 ",
    description:
      "Visualizes the Earth's rotation and allows users to explore its surface, including the transition between night and day.",
    tags: ["C++", "C"],
    labels: ["university", "archived"],
    year: "2024",
  },
] as const;
