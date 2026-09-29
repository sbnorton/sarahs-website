export interface DesignProject {
  number: string;
  title: string;
  category: string;
  description: string;
  accent: string;
  background: string;
}

export const designProjects: DesignProject[] = [
  {
    number: "01",
    title: "Vær-Varsom",
    category: "Editorial · Print",
    description:
      "A typographic interpretation of the Norwegian press ethics guidelines. Hierarchy, whitespace, and editorial rigour.",
    accent: "#c9b99a",
    background: "#2a2116",
  },
  {
    number: "02",
    title: "LocalEvent",
    category: "Mobile UI · Figma",
    description:
      "End-to-end UX design for the LocalEvent app - from user research and wireframes to a polished component library.",
    accent: "#8ecfc4",
    background: "#192926",
  },
  {
    number: "03",
    title: "Icebreaker Brand",
    category: "Identity · Illustration",
    description:
      "Visual identity and icon set for the Icebreaker team tool. Playful geometry that still reads in a professional context.",
    accent: "#b3aede",
    background: "#201e30",
  },
  {
    number: "04",
    title: "NTNU Poster Series",
    category: "Poster · Illustrator",
    description:
      "A three-piece poster series for a faculty event. Bold type locked to a strict grid with a restricted two-colour palette.",
    accent: "#d4c5a9",
    background: "#28221c",
  },
];
