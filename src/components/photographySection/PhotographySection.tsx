import { assetPathPrefix, scrollToSection } from "../../data/progammingSectionData"
import styles from "./PhotographySection.module.css"
import shared from "../../styles/shared.module.css"
import { cn } from "../portfolioStyles"

export default function PhotographySection() {
  return (
    <section className={cn(styles.photoSection, shared.sectionPad)} id="photography">
      <div className={cn(shared.sectionIntro, shared.light)}>
        <p className={cn(shared.eyebrow)}>03 - Photography</p>
        <p className={cn(shared.sectionCopy)}>
          Even though I sit in front of a computer a lot, I also enjoy taking
          photos; whether it be weddings, portraits, travel or landscape
          photography! Contact me if you are ever in need of a photographer
          with dad jokes. Take a look at some of my work here:
        </p>
      </div>
      <div className={cn(styles.photoStrip)}>
        <div className={cn(styles.photoEdge, styles.left)} />
        <div className={cn(styles.photoMain)} />
        <div className={cn(styles.photoEdge, styles.right)} />
      </div>
      <div className={cn(styles.galleryCta)}>
        <p>If you want to see more, you can:</p>
        <button type="button">Visit the gallery</button>
      </div>
      <button className={cn(styles.returnTop)} onClick={() => scrollToSection("welcome")}>
        Return to the top
      </button>
      <footer>
        <div className={cn(styles.footerRule)} aria-hidden="true">
          <img alt="" src={`${assetPathPrefix}/4394d.svg`} />
        </div>
        <div className={cn(styles.footerRow)}>
          <p>Sarah Norton</p>
          <div>
            <a href="https://linkedin.com">linkedin</a>
            <a href="https://instagram.com">instagram</a>
          </div>
        </div>
        <p className={cn(styles.copyright)}>
          <em>self created.</em>
          <br />
          All rights reserved. 2024
        </p>
      </footer>
    </section>
  )
}