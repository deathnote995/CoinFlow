import { useThemeStore } from "../../store/useThemeStore.js";

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

const Navbar = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
      className="border-b"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          style={{ color: "var(--accent)" }}
          className="text-xl font-bold tracking-tight"
        >
          CoinFlow
        </a>

        <ul className="flex items-center gap-6 text-sm">
          <li>
            <button
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
            </button>
          </li>

          <li>
            <a
              href="#features"
              style={{ color: "var(--text-muted)" }}
              className="transition hover:opacity-80"
            >
              Features
            </a>
          </li>

          <li>
            <a
              href="#analytics"
              style={{ color: "var(--text-muted)" }}
              className="transition hover:opacity-80"
            >
              Analytics
            </a>
          </li>

          <li>
            <a
              href="#security"
              style={{ color: "var(--text-muted)" }}
              className="transition hover:opacity-80"
            >
              Security
            </a>
          </li>

          <li>
            <button type="button" className="cf-btn-primary text-sm">
              Get Started
            </button>
          </li>

          <li>
            <button
              type="button"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            >
              Login
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;