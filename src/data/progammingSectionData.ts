export const assetPathPrefix = "/assets"

export const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "programming", label: "Programming" },
  { id: "design", label: "Design & UX" },
  { id: "photography", label: "Photography" },
] as const

export type SectionId = (typeof sections)[number]["id"]

export const projects = [
  {
    title: "LOCALEVENT",
    subtitle: "MOBILE APP DEVELOPMENT",
    tags: ["React Native", "Typescript"],
    tone: "mint",
  },
  {
    title: "ICEBREAKER",
    subtitle: "APP DEVELOPMENT TEAM PROJECT",
    tags: ["Tailwind CSS", "Firebase"],
    tone: "rose",
  },
  {
    title: "SOMETHING",
    subtitle: "DEVELOPMENT",
    tags: ["NodeJS", "Webflow"],
    tone: "blue",
  },
] as const

export function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}