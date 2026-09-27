import { useEffect, useState } from "react"
import { assetPathPrefix, scrollToSection, sections, type SectionId } from "../../data/progammingSectionData"
import styles from "./SectionOverview.module.css"
import { cn } from "../portfolioStyles"

export default function SectionOverview() {
  const [activeSection, setActiveSection] = useState<SectionId>("welcome")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id as SectionId)
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0, 0.2, 0.5] },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
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