import { useState } from "react";
import { Link } from "react-router-dom";

const FallbackQrSvg = () => (
  <svg
    viewBox="0 0 96 96"
    className="h-24 w-24 shrink-0"
    role="img"
    aria-label="Play Store companion QR placeholder"
  >
    <rect width="96" height="96" rx="10" fill="#ffffff" />
    <rect x="8" y="8" width="24" height="24" rx="3" fill="#1c1917" />
    <rect x="12" y="12" width="16" height="16" rx="1.5" fill="#ffffff" />
    <rect x="16" y="16" width="8" height="8" fill="#ea580c" />
    <rect x="64" y="8" width="24" height="24" rx="3" fill="#1c1917" />
    <rect x="68" y="12" width="16" height="16" rx="1.5" fill="#ffffff" />
    <rect x="72" y="16" width="8" height="8" fill="#ea580c" />
    <rect x="8" y="64" width="24" height="24" rx="3" fill="#1c1917" />
    <rect x="12" y="68" width="16" height="16" rx="1.5" fill="#ffffff" />
    <rect x="16" y="72" width="8" height="8" fill="#ea580c" />
    <rect x="42" y="42" width="12" height="12" rx="2" fill="#ea580c" />
    <rect x="64" y="64" width="20" height="20" rx="3" fill="#1c1917" />
    <rect x="70" y="70" width="8" height="8" fill="#ea580c" />
  </svg>
);

const CompanionQrBox = ({ compact = false }) => {
  const [imgMissing, setImgMissing] = useState(false);

  return (
    <div
      style={{ backgroundColor: "#ffffff" }}
      className={`${compact ? "h-20 w-20 p-1.5" : "h-28 w-28 p-2"} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-300`}
    >
      {!imgMissing ? (
        <img
          src="/play-store-qr.png"
          alt="Scan QR to download CoinFlow mobile companion on Play Store"
          onError={() => setImgMissing(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <FallbackQrSvg />
      )}
    </div>
  );
};

const HeroPreviewCard = () => (
  <div className="cf-card">
    <div className="flex items-center justify-between">
      <div>
        <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wider">
          Combined Net Balance
        </p>
        <p className="mt-1 text-3xl font-bold">₹1,48,250</p>
      </div>
      <span className="cf-badge-accent">Individual + Family</span>
    </div>

    {/* Mini SVG Sparkline */}
    <div
      style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-color)" }}
      className="mt-4 rounded-xl border p-3"
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>30-Day Cash Flow</span>
        <span style={{ color: "var(--accent)" }} className="font-semibold">
          +14.2% net saved
        </span>
      </div>
      <svg viewBox="0 0 300 72" className="h-16 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="cfSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 4 56 L 54 44 L 104 49 L 154 26 L 204 33 L 254 14 L 296 20 L 296 68 L 4 68 Z"
          fill="url(#cfSparkGrad)"
        />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="4,56 54,44 104,49 154,26 204,33 254,14 296,20"
        />
      </svg>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 text-left text-sm">
      <div
        style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-color)" }}
        className="rounded-lg border p-3"
      >
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Monthly Inflow
        </p>
        <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">+₹92,000</p>
      </div>
      <div
        style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-color)" }}
        className="rounded-lg border p-3"
      >
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Monthly Spend
        </p>
        <p style={{ color: "var(--accent)" }} className="mt-1 font-semibold">
          -₹38,750
        </p>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <span className="cf-badge-accent mb-4 inline-block">
          Personal &amp; Shared Household Finance
        </span>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Track every rupee across wallets, people, and accounts.
        </h1>

        <p
          style={{ color: "var(--text-muted)" }}
          className="mt-4 max-w-xl text-base leading-relaxed"
        >
          Manage multiple wallets on your own or share a household account with family members to
          track cumulative expenses and view everyone&apos;s transactions in one place.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link to="/register" type="button" className="cf-btn-primary">
            Get Started
          </Link>
          <a
            href="#features"
            style={{ borderColor: "var(--border-color)" }}
            className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition hover:opacity-80"
          >
            Explore Features
          </a>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
          className="mt-8 flex flex-col items-start gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
        >
          <CompanionQrBox />
          <div>
            <p className="text-sm font-semibold">Mobile Companion QR (Play Store Ready)</p>
            <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs leading-relaxed">
              Drop your Play Store QR image at{" "}
              <code style={{ color: "var(--accent)" }}>public/play-store-qr.png</code> once live.
              Useful for tracking other UPIs and credit cards—mobile version isn&apos;t ready yet.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <HeroPreviewCard />
      </div>
    </section>
  );
};

export { CompanionQrBox };
export default HeroSection;