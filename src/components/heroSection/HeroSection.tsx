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
        src={`${assetPathPrefix}/images/mjaavatn.png`}
        alt="Aerial view of kayaks"
      />
      <div className={cn(styles.heroShade)} />
      <header className={cn(styles.siteHeader)}>
        <a className={cn(styles.brand)} href="/">
          <img
            className={cn(styles.brandLogo)}
            src={`${assetPathPrefix}/svg/logo/sarahslogo-white.svg`}
            alt=""
            aria-hidden="true"
          />
          SARAH NORTON
        </a>
        <nav className={cn(styles.topNav)} aria-label="Main navigation">
          <a href="/">HOMEPAGE</a>
          <a href="/photography">PHOTOGRAPHY</a>
          <a href="/programming">PROGRAMMING</a>
          <a href="/programming">PROJECTS</a>
          <a href="/about">ABOUT ME</a>
          <a href="/contact">CONTACT</a>
        </nav>
        <button
          className={cn(styles.toneToggle)}
          aria-label="Toggle dark mode"
          aria-pressed={darkMode}
          onClick={onToggleDarkMode}
        >
          <img alt="" src={`${assetPathPrefix}/svg/ce81b.svg`} />
        </button>
      </header>
      <p className={cn(styles.heroTitle)}>WELCOME TO MY PORTFOLIO</p>
    </section>
  )
}