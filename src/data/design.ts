export interface DesignProject {
  number: string;
  title: string;
  category: string;
  description: string;
  accent: string;
  background: string;
  url: string;
}

export const designProjects: DesignProject[] = [
  {
    number: "01",
    title: "Vær-Varsom",
    category: "Editorial · Print",
    description:
      "Heia ytringsfriheten!",
    accent: "#c9b99a",
    background: "#2a2116",
    url: "https://www.presse.no/vaer-varsom-plakaten"
  },
];
