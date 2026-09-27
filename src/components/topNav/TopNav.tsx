import { useEffect, useState } from "react";
import { assetPathPrefix } from "../../data/progammingSectionData";
import styles from "./TopNav.module.css";
import { cn } from "../portfolioStyles";

interface Props {
  overHero?: boolean;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function TopNav({
  overHero = false,
  darkMode,
  onToggleDarkMode,
}: Props) {
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isDarkMode = darkMode ?? internalDarkMode;
  const toggleDarkMode =
    onToggleDarkMode ?? (() => setInternalDarkMode((current) => !current));
  const logo = overHero ? "sarahslogo-white.svg" : "sarahslogo-black.svg";
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, "") || "/");
    };

    updatePath();
    window.addEventListener("popstate", updatePath);
    window.addEventListener("astro:after-swap", updatePath);
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("astro:after-swap", updatePath);
    };
  }, []);
  const links = [
    { href: "/", label: "HOMEPAGE" },
    { href: "/programming", label: "PROGRAMMING" },
    { href: "/photography", label: "PHOTOGRAPHY" },
    { href: "/programming", label: "DESIGN", active: false },
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
        {links.map((link) => (
          <a
            className={cn(
              currentPath === link.href &&
                link.active !== false &&
                styles.active,
            )}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
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
