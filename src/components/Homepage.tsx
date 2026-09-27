import { useState } from "react"
import DesignSection from "./designSection/DesignSection"
import HeroSection from "./heroSection/HeroSection"
import PhotographySection from "./photographySection/PhotographySection"
import ProgrammingSection from "./programmingSection/ProgrammingSection"
import SectionOverview from "./sectionOverview/SectionOverview"
import styles from "./Homepage.module.css"
import { cn } from "./portfolioStyles"
import "../styles/global.css"

export default function Homepage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <main className={cn(styles.site, darkMode && styles.dark, darkMode && "dark")}>
      <SectionOverview />
      <HeroSection
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((current) => !current)}
      />
      <ProgrammingSection />
      <PhotographySection />
      <DesignSection />
    </main>
  )
}