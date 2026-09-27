import { assetPathPrefix, scrollToSection } from "../../data/progammingSectionData"
import styles from "./HeroSection.module.css"
import { cn } from "../portfolioStyles"

interface Props {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function HeroSection({ darkMode, onToggleDarkMode }: Props) {
  return (
    <section className={cn(styles.hero)} id="welcome">
      <img
        className={cn(styles.heroImage)}
        src={`${assetPathPrefix}/49325.png`}
        alt="Aerial view of people walking across a dark landscape"
      />
      <div className={cn(styles.heroShade)} />
      <header className={cn(styles.siteHeader)}>
        <button className={cn(styles.brand)} onClick={() => scrollToSection("welcome")}>
          SARAH NORTON
        </button>
        <nav className={cn(styles.topNav)} aria-label="Main navigation">
          <button onClick={() => scrollToSection("programming")}>WORK</button>
          <button onClick={() => scrollToSection("design")}>ABOUT</button>
          <button onClick={() => scrollToSection("photography")}>CV</button>
          <a href="mailto:hello@sarahnorton.dev">CONTACTS</a>
        </nav>
        <button
          className={cn(styles.toneToggle)}
          aria-label="Toggle dark mode"
          aria-pressed={darkMode}
          onClick={onToggleDarkMode}
        >
          <img alt="" src={`${assetPathPrefix}/ce81b.svg`} />
        </button>
      </header>
      <p className={cn(styles.heroTitle)}>WELCOME TO MY PORTFOLIO</p>
    </section>
  )
}