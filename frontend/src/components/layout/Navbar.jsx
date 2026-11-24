import { useEffect, useState } from "react";
import { useThemeStore } from "../../store/useThemeStore.js";
import { Link } from "react-router-dom";
import ThemeToggleButton from "../common/ThemeToggleButton.jsx";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Companion", href: "#companion" },
  { label: "Security", href: "#security" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
//   const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
      className="sticky top-0 z-30 w-full border-b"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <a
          href="#top"
          onClick={closeMenu}
          style={{ color: "var(--accent)" }}
          className="shrink-0 text-xl font-bold tracking-tight"
        >
          CoinFlow
        </a>

        {/* Desktop Navigation (md and up) */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{ color: "var(--text-muted)" }}
                  className="transition hover:opacity-80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--accent)",
                borderColor: "var(--border-color)",
              }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition hover:opacity-85"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button> */}
            <ThemeToggleButton/>

            <Link
              to="/login"
            //   type="button"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            >
              Login
            </Link>

            <Link to="/register" type="button" className="cf-btn-primary whitespace-nowrap text-sm">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Controls: Theme Toggle + Hamburger (< md) */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--accent)",
              borderColor: "var(--border-color)",
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition hover:opacity-85"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button> */}

            <ThemeToggleButton/>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-main)",
              borderColor: "var(--border-color)",
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition hover:opacity-85"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
          className="border-t px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  style={{ color: "var(--text-main)" }}
                  className="block rounded-lg px-2 py-1.5 font-medium transition hover:opacity-80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            style={{ borderColor: "var(--border-color)" }}
            className="mt-4 flex flex-col gap-2.5 border-t pt-4"
          >
            <Link
              to="/login"
            //   type="button"
              onClick={closeMenu}
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="w-full cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            >
              Login
            </Link>
            <Link
              to="/register"
            //   type="button"
              onClick={closeMenu}
              className="cf-btn-primary w-full text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;