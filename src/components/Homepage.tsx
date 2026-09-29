import DesignSection from "./sections/designSection/DesignSection"
import HeroSection from "./sections/heroSection/HeroSection"
import PhotographySection from "./sections/photographySection/PhotographySection"
import ProgrammingSection from "./sections/programmingSection/ProgrammingSection"
import SectionOverview from "./sectionOverview/SectionOverview"
import styles from "./Homepage.module.css"
import { cn } from "./portfolioStyles"
import "../styles/global.css"

export default function Homepage() {
  return (
    <main className={cn(styles.site)}>
      <SectionOverview />
      <HeroSection />
      <ProgrammingSection />
      <PhotographySection />
      <DesignSection />
    </main>
  )
}