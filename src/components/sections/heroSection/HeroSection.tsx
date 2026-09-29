import { assetPathPrefix } from '../../../data/programmingProjects';
import styles from './HeroSection.module.css';
import { cn } from '../../portfolioStyles';

export default function HeroSection() {
  return (
    <section className={cn(styles.hero)} id="welcome">
      <img
        className={cn(styles.heroImage)}
        src={`${assetPathPrefix}/images/mjaavatn.png`}
        alt="Aerial view of kayaks"
      />

      <div className={cn(styles.heroShade)} />

      <p className={cn(styles.heroTitle)}>WELCOME TO MY PORTFOLIO</p>
    </section>
  );
}
