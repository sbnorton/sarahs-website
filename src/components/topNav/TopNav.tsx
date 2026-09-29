import { useEffect, useState } from 'react';

import { assetPathPrefix } from '../../data/programmingProjects';
import styles from './TopNav.module.css';
import { cn } from '../portfolioStyles';

export default function TopNav() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePath, setActivePath] = useState('/');
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

      <nav className={cn(styles.topNav)} aria-label="Main navigation">
        {links.map((link) => {
          const isActive = activePath === getNormalizedPath(link.href);

          return (
            <a key={link.href} className={cn(isActive && styles.active)} href={link.href}>
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
