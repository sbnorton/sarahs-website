import { assetPathPrefix, scrollToSection } from "../../../data/progammingSectionData";
import styles from "./DesignSection.module.css";
import shared from "/src/styles/shared.module.css";
import { cn } from "../../portfolioStyles";

export default function DesignSection() {
  return (
    <section
      className={cn(styles.designSection, shared.sectionPad)}
      id="design"
    >
      <div className={cn(shared.sectionIntro, shared.light)}>
        <p className={cn(shared.eyebrow)}>03 - Design &amp; UX</p>
        <p className={cn(shared.sectionCopy)}>
          With a background from <em>Medier og Kommunikasjon</em>, tools like
          Figma and Adobe Illustrator are not unknown to me. I would also like
          to mention that I probably know more about Vær Varsom-plakaten, than the
          average person.
        </p>
      </div>
      <div className={cn(styles.masonry)} aria-label="Design project previews">
        <div className={cn(styles.tile, styles.tall, styles.soft)} />
        <div className={cn(styles.tile, styles.short, styles.pale)} />
        <div className={cn(styles.tile, styles.medium, styles.warm)} />
        <div className={cn(styles.tile, styles.medium, styles.mid)} />
        <div className={cn(styles.tile, styles.tall, styles.pale)} />
        <div className={cn(styles.tile, styles.short, styles.white)} />
        <a className={cn(styles.moreDesign)} href="/design">
          Click-here-to-see-more-random-design-projects-button:))
        </a>
      </div>
      <div className={cn(styles.sectionRule)} aria-hidden="true">
        <img alt="" src={`${assetPathPrefix}/svg/1f7c2.svg`} />
      </div>
      <button
        className={cn(styles.returnTop)}
        onClick={() => scrollToSection("welcome")}
      >
        Return to the top
      </button>
    </section>
  );
}
