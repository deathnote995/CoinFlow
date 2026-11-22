import { Link } from "react-router-dom";
import Footer from "../layout/Footer";
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

const AuthSplitLayout = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-app)",
        color: "var(--text-main)",
      }}
      className="flex min-h-screen flex-col"
    >
      {/* Top Bar */}
      <header
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
        className="w-full border-b"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            style={{ color: "var(--accent)" }}
            className="text-xl font-bold tracking-tight"
          >
            CoinFlow
          </Link>

          <div className="flex items-center gap-3">
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

            <Link
              to="/"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="rounded-lg border px-3.5 py-1.5 text-sm font-medium transition hover:opacity-80"
            >
              &larr; Home
            </Link>
          </div>
        </div>
      </header>

      {/* 50/50 Split Content */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
        {/* Left Half: CoinFlow Showcase / Advertisement */}
        <section
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
          className="flex flex-col justify-between rounded-2xl border p-8 sm:p-10"
        >
          <div>
            <span className="cf-badge-accent">CoinFlow</span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Expense management made simple.
            </h1>
            <p
              style={{ color: "var(--text-muted)" }}
              className="mt-3 text-sm leading-relaxed sm:text-base"
            >
              Track individual wallets or manage a shared family account where everyone can view
              transactions, monitor cumulative spending, and catch low balances early.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <span style={{ color: "var(--accent)" }} className="font-bold">
                  &#10003;
                </span>
                <span>Multi-wallet balances across bank accounts, UPI, and cash</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span style={{ color: "var(--accent)" }} className="font-bold">
                  &#10003;
                </span>
                <span>Individual &amp; family plans with shared household visibility</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span style={{ color: "var(--accent)" }} className="font-bold">
                  &#10003;
                </span>
                <span>Monthly analytics, category breakdowns, and threshold alerts</span>
              </li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-color)",
            }}
            className="mt-8 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Monthly Household Summary</span>
              <span style={{ color: "var(--accent)" }} className="font-semibold">
                On Track
              </span>
            </div>
            <p className="mt-1 text-xl font-bold">₹42,300 spent of ₹60,000 budget</p>
            <div
              style={{ backgroundColor: "var(--bg-surface)" }}
              className="mt-3 h-2 w-full overflow-hidden rounded-full"
            >
              <div
                style={{ width: "70%", backgroundColor: "var(--accent)" }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        </section>

        {/* Right Half: Form Slot */}
        <section className="flex items-center justify-center">
          <div className="cf-card w-full max-w-md p-6 sm:p-8">{children}</div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AuthSplitLayout;