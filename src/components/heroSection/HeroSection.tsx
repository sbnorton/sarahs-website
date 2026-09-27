import { assetPathPrefix } from "../../data/progammingSectionData"
import styles from "./HeroSection.module.css"
import { cn } from "../portfolioStyles"
import TopNav from "../topNav/TopNav"

interface Props {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function HeroSection({ darkMode, onToggleDarkMode }: Props) {
  return (
    <section className={cn(styles.hero)} id="welcome">
      <img
        className={cn(styles.heroImage)}
        src={`${assetPathPrefix}/images/mjaavatn.png`}
        alt="Aerial view of kayaks"
      />
      <div className={cn(styles.heroShade)} />
      <TopNav
        overHero
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <p className={cn(styles.heroTitle)}>WELCOME TO MY PORTFOLIO</p>
    </section>
  )
}