import { useState } from "react"
import DesignSection from "./sections/designSection/DesignSection"
import HeroSection from "./sections/heroSection/HeroSection"
import PhotographySection from "./sections/photographySection/PhotographySection"
import ProgrammingSection from "./sections/programmingSection/ProgrammingSection"
import SectionOverview from "./sectionOverview/SectionOverview"
import styles from "./Portfolio.module.css"
import { cn } from "./portfolioStyles"

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <main className={cn(styles.site, darkMode && styles.dark)}>
      <SectionOverview />
      <HeroSection
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
      />
      <ProgrammingSection />
      <DesignSection />
      <PhotographySection />
    </main>
  )
}