import { useEffect, useState } from "react";
import { assetPathPrefix } from "../../data/programmingProjects";
import styles from "./TopNav.module.css";
import { cn } from "../portfolioStyles";

interface Props {
  overHero?: boolean;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentPath?: string;
}

export default function TopNav({
  overHero = false,
  darkMode,
  onToggleDarkMode,
  currentPath,
}: Props) {
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isDarkMode = darkMode ?? internalDarkMode;
  const toggleDarkMode =
    onToggleDarkMode ?? (() => setInternalDarkMode((current) => !current));
  
  const logo =
    overHero || isDarkMode ? "sarahslogo-white.svg" : "sarahslogo-black.svg";

  // Renamed state variable to avoid collision with the prop name
  // Standardize the initial path from props or window
  const getNormalizedPath = (path?: string) => {
    if (!path) return "/";
    const cleaned = path.replace(/\/$/, "");
    return cleaned === "" ? "/" : cleaned;
  };

  const [activePath, setActivePath] = useState(() => 
    getNormalizedPath(currentPath)
  );

  useEffect(() => {
    const updatePath = () => {
      setActivePath(getNormalizedPath(window.location.pathname));
    };

    updatePath();
    window.addEventListener("popstate", updatePath);
    window.addEventListener("astro:after-swap", updatePath);
    
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("astro:after-swap", updatePath);
    };
  }, []);

  // Sync state if currentPath prop updates from Astro page navigation
  useEffect(() => {
    if (currentPath) {
      setActivePath(getNormalizedPath(currentPath));
    }
  }, [currentPath]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [isDarkMode, overHero]);

  const links = [
    { href: "/", label: "HOMEPAGE" },
    { href: "/programming", label: "PROGRAMMING" },
    { href: "/photography", label: "PHOTOGRAPHY" },
    { href: "/design", label: "DESIGN" },
    { href: "/about", label: "ABOUT ME" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header className={cn(styles.siteHeader, overHero && styles.overHero)}>
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
            <a
              key={link.href}
              className={cn(isActive && styles.active)}
              href={link.href}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <button
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