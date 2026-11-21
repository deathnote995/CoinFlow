import { CompanionQrBox } from "./HeroSection";

const LargePhoneMockup = () => (
  <svg
    viewBox="0 0 280 420"
    className="mx-auto h-80 w-auto sm:h-96"
    role="img"
    aria-label="Large mobile companion preview for CoinFlow"
  >
    {/* Background accent ring */}
    <circle cx="140" cy="210" r="125" fill="var(--accent-soft)" />

    {/* Phone outer frame */}
    <rect
      x="54"
      y="16"
      width="172"
      height="388"
      rx="28"
      fill="var(--bg-surface)"
      stroke="var(--border-color)"
      strokeWidth="4"
    />

    {/* Inner screen */}
    <rect
      x="64"
      y="28"
      width="152"
      height="364"
      rx="22"
      fill="var(--bg-app)"
    />

    {/* Notch & status bar */}
    <rect x="108" y="34" width="64" height="14" rx="7" fill="var(--bg-surface)" />
    <circle cx="158" cy="41" r="3" fill="var(--accent)" />
    <text x="80" y="64" fill="var(--text-muted)" fontSize="10" fontWeight="600">
      CoinFlow Companion
    </text>
    <text x="172" y="64" fill="var(--accent)" fontSize="10" fontWeight="600">
      Soon
    </text>

    {/* Balance card inside phone */}
    <rect
      x="76"
      y="76"
      width="128"
      height="74"
      rx="12"
      fill="var(--bg-surface)"
      stroke="var(--border-color)"
    />
    <text x="88" y="96" fill="var(--text-muted)" fontSize="9">
      OTHER UPI &amp; CARDS
    </text>
    <text x="88" y="118" fill="var(--text-main)" fontSize="17" fontWeight="700">
      ₹24,890
    </text>
    <text x="88" y="136" fill="var(--accent)" fontSize="9.5" fontWeight="600">
      Synced with Web Account
    </text>

    {/* Sample payment rows inside phone */}
    <rect
      x="76"
      y="162"
      width="128"
      height="54"
      rx="10"
      fill="var(--bg-surface)"
      stroke="var(--border-color)"
    />
    <circle cx="94" cy="189" r="10" fill="var(--accent-soft)" />
    <text x="94" y="192" textAnchor="middle" fill="var(--accent)" fontSize="9" fontWeight="700">
      UPI
    </text>
    <text x="112" y="184" fill="var(--text-main)" fontSize="10.5" fontWeight="600">
      External UPI Spend
    </text>
    <text x="112" y="199" fill="var(--text-muted)" fontSize="9">
      -₹640 · Groceries
    </text>

    <rect
      x="76"
      y="226"
      width="128"
      height="54"
      rx="10"
      fill="var(--bg-surface)"
      stroke="var(--border-color)"
    />
    <circle cx="94" cy="253" r="10" fill="var(--accent-soft)" />
    <text x="94" y="256" textAnchor="middle" fill="var(--accent)" fontSize="8.5" fontWeight="700">
      CC
    </text>
    <text x="112" y="248" fill="var(--text-main)" fontSize="10.5" fontWeight="600">
      Credit Card Swipe
    </text>
    <text x="112" y="263" fill="var(--text-muted)" fontSize="9">
      -₹2,450 · Dining
    </text>

    {/* Status banner at bottom of screen */}
    <rect x="76" y="296" width="128" height="48" rx="12" fill="var(--accent)" />
    <text
      x="140"
      y="316"
      textAnchor="middle"
      fill="var(--accent-text)"
      fontSize="10.5"
      fontWeight="700"
    >
      Mobile Version
    </text>
    <text
      x="140"
      y="331"
      textAnchor="middle"
      fill="var(--accent-text)"
      fontSize="9.5"
    >
      Not Ready Yet
    </text>

    {/* Home indicator */}
    <rect x="114" y="374" width="52" height="4" rx="2" fill="var(--border-color)" />
  </svg>
);

const CompanionAppSection = () => {
  return (
    <section id="companion" className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="cf-card grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="cf-badge-accent">Mobile Companion</span>
            <span
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-muted)",
                borderColor: "var(--border-color)",
              }}
              className="rounded-full border px-3 py-0.5 text-xs font-medium"
            >
              Mobile app not ready yet
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Built to track payments made via other UPIs or credit cards
          </h2>

          <p
            style={{ color: "var(--text-muted)" }}
            className="mt-3 text-sm leading-relaxed sm:text-base"
          >
            The mobile companion is designed to help you track payments made through other UPI apps
            or credit cards so those expenses don&apos;t slip past your CoinFlow account. Please
            note that the mobile version of CoinFlow is not ready yet.
          </p>

          <div
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-color)",
            }}
            className="mt-6 flex flex-col items-start gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
          >
            <CompanionQrBox compact />
            <div className="text-xs">
              <p className="text-sm font-semibold">Play Store QR Placeholder</p>
              <p style={{ color: "var(--text-muted)" }} className="mt-1 leading-relaxed">
                Once the mobile companion is published on Google Play, replace{" "}
                <code style={{ color: "var(--accent)" }}>public/play-store-qr.png</code> with your
                live Play Store QR code. Until then, use the CoinFlow web app.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <LargePhoneMockup />
        </div>
      </div>
    </section>
  );
};

export default CompanionAppSection;