import { useEffect, useState } from "react"
import styles from "../styles/portfolio.module.css"

const cn = (...names: Array<string | false | undefined>) =>
  names
    .filter(Boolean)
    .map((name) => styles[name as string])
    .join(" ")

const assetPathPrefix = "/assets"

const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "programming", label: "Programming" },
  { id: "design", label: "Design & UX" },
  { id: "photography", label: "Photography" },
] as const

type SectionId = typeof sections[number]["id"]

const projects = [
  {
    title: "LOCALEVENT",
    subtitle: "MOBILE APP DEVELOPMENT",
    tags: ["React Native", "Typescript"],
    tone: "mint",
  },
  {
    title: "ICEBREAKER",
    subtitle: "APP DEVELOPMENT TEAM PROJECT",
    tags: ["Tailwind CSS", "Firebase"],
    tone: "rose",
  },
  {
    title: "SOMETHING",
    subtitle: "DEVELOPMENT",
    tags: ["NodeJS", "Webflow"],
    tone: "blue",
  },
] as const

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function SectionOverview({ active }: { active: SectionId }) {
  return (
    <nav className={cn("section-overview")} aria-label="Page sections">
      {sections.map((section, index) => {
        const isActive = section.id === active
        return (
          <button
            className={cn("overview-item", isActive && "is-active")}
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            aria-current={isActive ? "location" : undefined}
            aria-label={`Go to ${section.label}`}
          >
            <span className={cn("overview-label")}>- {section.label}</span>
            <span className={cn("overview-number")}>0{index + 1}</span>
            <img
              alt=""
              aria-hidden="true"
              src={`${assetPathPrefix}/9d52b.svg`}
            />
          </button>
        )
      })}
    </nav>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("welcome")
  const [darkMode, setDarkMode] = useState(false)

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
    <main className={cn("site", darkMode && "dark")}>
      <SectionOverview active={activeSection} />

      <section className={cn("hero")} id="welcome">
        <img
          className={cn("hero-image")}
          src={`${assetPathPrefix}/49325.png`}
          alt="Aerial view of people walking across a dark landscape"
        />
        <div className={cn("hero-shade")} />
        <header className={cn("site-header")}>
          <button className={cn("brand")} onClick={() => scrollToSection("welcome")}>
            SARAH NORTON
          </button>
          <nav className={cn("top-nav")} aria-label="Main navigation">
            <button onClick={() => scrollToSection("programming")}>WORK</button>
            <button onClick={() => scrollToSection("design")}>ABOUT</button>
            <button onClick={() => scrollToSection("photography")}>CV</button>
            <a href="mailto:hello@sarahnorton.dev">CONTACTS</a>
          </nav>
          <button
            className={cn("tone-toggle")}
            aria-label="Toggle dark mode"
            aria-pressed={darkMode}
            onClick={() => setDarkMode((current) => !current)}
          >
            <img alt="" src={`${assetPathPrefix}/ce81b.svg`} />
          </button>
        </header>
        <p className={cn("hero-title")}>WELCOME TO MY PORTFOLIO</p>
      </section>

      <section className={cn("programming", "section-pad")} id="programming">
        <div className={cn("section-intro")}>
          <p className={cn("eyebrow")}>01 - Programming</p>
          <p className={cn("section-copy")}>
            As a computer science student at NTNU, I have worked on countless
            different projects. Here are some of them:
          </p>
        </div>
        <div className={cn("project-grid")}>
          {projects.map((project) => (
            <article
              className={cn("project-card", project.tone)}
              key={project.title}
            >
              <div>
                <p className={cn("project-title")}>
                  {project.title}
                  <br />
                  {project.subtitle}
                </p>
              </div>
              <div className={cn("project-meta")}>
                <p>About the app here</p>
                <span className={cn("card-rule")} aria-hidden="true">
                  <img alt="" src={`${assetPathPrefix}/9a1d2.svg`} />
                </span>
                <div className={cn("tag-row")}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <a className={cn("course-link")} href="#design">
            Moving in 3D space;
            <br />
            TDT4196 - Grunnleggende visuell databehandling
          </a>
        </div>
      </section>

      <section className={cn("design-section", "section-pad")} id="design">
        <div className={cn("section-intro", "light")}>
          <p className={cn("eyebrow")}>02 - Design &amp; UX</p>
          <p className={cn("section-copy")}>
            With a background from <em>Medier og Kommunikasjon</em>, tools like
            Figma and Adobe Illustrator are not unknown to me. And let&apos;s
            not forget Vær-Varsom plakaten of course.
          </p>
        </div>
        <div className={cn("masonry")} aria-label="Design project previews">
          <div className={cn("tile", "tall", "soft")} />
          <div className={cn("tile", "short", "pale")} />
          <div className={cn("tile", "medium", "warm")} />
          <div className={cn("tile", "medium", "mid")} />
          <div className={cn("tile", "tall", "pale")} />
          <div className={cn("tile", "short", "white")} />
          <a className={cn("more-design")} href="#photography">
            Click-here-to-see-more-random-design-projects-button:))
          </a>
        </div>
        <div className={cn("section-rule")} aria-hidden="true">
          <img alt="" src={`${assetPathPrefix}/1f7c2.svg`} />
        </div>
      </section>

      <section className={cn("photo-section", "section-pad")} id="photography">
        <div className={cn("section-intro", "light")}>
          <p className={cn("eyebrow")}>03 - Photography</p>
          <p className={cn("section-copy")}>
            Even though I sit in front of a computer a lot, I also enjoy taking
            photos; whether it be weddings, portraits, travel or landscape
            photography! Contact me if you are ever in need of a photographer
            with dad jokes. Take a look at some of my work here:
          </p>
        </div>
        <div className={cn("photo-strip")}>
          <div className={cn("photo-edge", "left")} />
          <div className={cn("photo-main")} />
          <div className={cn("photo-edge", "right")} />
        </div>
        <div className={cn("gallery-cta")}>
          <p>If you want to see more, you can:</p>
          <button type="button">Visit the gallery</button>
        </div>
        <button
          className={cn("return-top")}
          onClick={() => scrollToSection("welcome")}
        >
          Return to the top
        </button>
        <footer>
          <div className={cn("footer-rule")} aria-hidden="true">
            <img alt="" src={`${assetPathPrefix}/4394d.svg`} />
          </div>
          <div className={cn("footer-row")}>
            <p>Sarah Norton</p>
            <div>
              <a href="https://linkedin.com">linkedin</a>
              <a href="https://instagram.com">instagram</a>
            </div>
          </div>
          <p className={cn("copyright")}>
            <em>self created.</em>
            <br />
            All rights reserved. 2024
          </p>
        </footer>
      </section>
    </main>
  )
}

export default App
