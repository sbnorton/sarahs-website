export const availableProjectTags = ["typescript", "react", "astro", "python"] as const

export const projectTagDefinitions = {
  typescript: { label: "TypeScript" },
  react: { label: "React" },
  astro: { label: "Astro" },
  python: { label: "Python" },
} as const

export const projectStatusDefinitions = {
  shipped: { label: "Shipped", tone: "lime" },
  active: { label: "Active", tone: "sky" },
  university: { label: "University", tone: "universityBlue" },
} as const

export const projects = [
  {
    name: "Localevent",
    description: "A mobile app for discovering and sharing local events.",
    tags: ["typescript", "react"],
    status: "shipped",
    year: "2024",
  },
  {
    name: "Icebreaker",
    description: "A collaborative team project built around playful connection.",
    tags: ["react", "python"],
    status: "university",
    year: "2023",
  },
  {
    name: "Moving in 3D space",
    description: "An exploration of visual computing and interactive space.",
    tags: ["typescript", "astro"],
    status: "active",
    year: "2024",
  },
] as const
