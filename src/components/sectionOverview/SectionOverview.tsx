import { useEffect, useState } from "react"
import { assetPathPrefix, scrollToSection, sections, type SectionId } from "../../data/progammingSectionData"
import styles from "./SectionOverview.module.css"
import { cn } from "../portfolioStyles"

export default function SectionOverview() {
  const [activeSection, setActiveSection] = useState<SectionId>("welcome")

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const anchor = window.innerHeight * 0.35
      const active = sections.find(({ id }) => {
        const element = document.getElementById(id)
        if (!element) return false
        const bounds = element.getBoundingClientRect()
        return bounds.top <= anchor && bounds.bottom > anchor
      })

      if (active) setActiveSection(active.id)
    }
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav className={cn(styles.sectionOverview)} aria-label="Page sections">
      {sections.map((section, index) => {
        const isActive = section.id === activeSection
        return (
          <button
            className={cn(styles.overviewItem, isActive && styles.isActive)}
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            aria-current={isActive ? "location" : undefined}
            aria-label={`Go to ${section.label}`}
          >
            <span className={cn(styles.overviewLabel)}>- {section.label}</span>
            <span className={cn(styles.overviewNumber)}>0{index + 1}</span>
            <img alt="" aria-hidden="true" src={`${assetPathPrefix}/svg/9d52b.svg`} />
          </button>
        )
      })}
    </nav>
  )
}