import { useEffect, useState } from 'react';

import { assetPathPrefix } from '../../../data/programmingProjects';
import styles from './TopNav.module.css';
import { cn } from '../../portfolioStyles';

export default function TopNav() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomepage = activePath === '/';

  const getNormalizedPath = (path?: string) => {
    if (!path) return '/';

    const cleaned = path.replace(/\/$/, '');

    return cleaned === '' ? '/' : cleaned;
  };

  // Read the existing document theme after React has mounted.
  useEffect(() => {
    setIsDarkMode(document.documentElement.dataset.theme === 'dark');
  }, []);

  useEffect(() => {
    const updateNavigation = () => {
      setActivePath(getNormalizedPath(window.location.pathname));
      setIsMenuOpen(false);

      setIsDarkMode(document.documentElement.dataset.theme === 'dark');
    };

    updateNavigation();

    window.addEventListener('popstate', updateNavigation);
    document.addEventListener('astro:after-swap', updateNavigation);

    return () => {
      window.removeEventListener('popstate', updateNavigation);
      document.removeEventListener('astro:after-swap', updateNavigation);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.removeProperty('overflow');
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    const nextTheme = document.documentElement.dataset.theme !== 'dark';

    document.documentElement.dataset.theme = nextTheme ? 'dark' : 'light';

    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');

    setIsDarkMode(nextTheme);
  };

  const logo = isHomepage || isDarkMode ? 'sarahslogo-white.svg' : 'sarahslogo-black.svg';

  const links = [
    { href: '/', label: 'HOMEPAGE' },
    { href: '/programming', label: 'PROGRAMMING' },
    { href: '/photography', label: 'PHOTOGRAPHY' },
    { href: '/design', label: 'DESIGN' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ];

  return (
    <header className={cn(styles.siteHeader, isHomepage && styles.overHero)}>
      <a className={cn(styles.brand)} href="/">
        <img
          className={cn(styles.brandLogo)}
          src={`${assetPathPrefix}/svg/logo/${logo}`}
          alt=""
          aria-hidden="true"
        />
        SARAH NORTON
      </a>

      <button
        type="button"
        className={cn(styles.menuToggle)}
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <button
          type="button"
          className={styles.menuBackdrop}
          aria-label="Close navigation menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav
        id="main-navigation"
        className={cn(styles.topNav, isMenuOpen && styles.menuOpen)}
        aria-label="Main navigation"
      >
        {links.map((link) => {
          const isActive = activePath === getNormalizedPath(link.href);

          return (
            <a
              key={link.href}
              className={cn(isActive && styles.active)}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn(styles.toneToggle)}
        aria-label="Toggle dark mode"
        aria-pressed={isDarkMode}
        onClick={toggleDarkMode}
      >
        <img alt="" src={`${assetPathPrefix}/svg/ce81b.svg`} />
      </button>
    </header>
  );
}
