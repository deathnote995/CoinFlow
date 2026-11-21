const FeatureIcon = ({ type }) => {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-5 w-5",
    "aria-hidden": "true",
  };

  switch (type) {
    case "household":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "wallets":
      return (
        <svg {...props}>
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      );
    case "bulk":
      return (
        <svg {...props}>
          <path d="M12 3v12" />
          <path d="m17 8-5-5-5 5" />
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        </svg>
      );
    case "categories":
      return (
        <svg {...props}>
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    case "alerts":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
  }
};

const FEATURES = [
  {
    icon: "household",
    title: "Individual & Shared Family Accounts",
    description:
      "Use CoinFlow solo for personal finances or link multiple family members under one shared account so everyone can see all transactions and track cumulative household spending together.",
  },
  {
    icon: "wallets",
    title: "Multi-Wallet Balance Tracking",
    description:
      "Keep separate balances for salary bank accounts, everyday UPI accounts, cash, and credit cards while viewing your total available funds across all wallets in one dashboard.",
  },
  {
    icon: "bulk",
    title: "Single & Bulk Transaction Entry",
    description:
      "Log daily expenses in seconds or import batches of transactions at once when catching up on weekly spending, bill settlements, or statement exports.",
  },
  {
    icon: "categories",
    title: "Automatic Expense Categorization",
    description:
      "Sort transactions into categories like Groceries, Food & Dining, Utilities, Rent, Commute, and Shopping so you immediately know which areas drive your monthly burn.",
  },
  {
    icon: "alerts",
    title: "Low-Balance & Limit Alerts",
    description:
      "Set minimum balance thresholds on specific wallets or spending limits on categories and get notified before an account runs dry or a monthly budget slips.",
  },
  {
    icon: "calendar",
    title: "Month & Custom Date Filtering",
    description:
      "Filter totals, charts, and transaction tables by a specific calendar month or custom date range to compare spending across periods or review past bills.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="max-w-2xl">
        <span className="cf-badge-accent">Features</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Built for solo control and shared household clarity
        </h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-2 text-sm sm:text-base">
          Whether you are managing personal cash flow or tracking family expenses collectively, every
          tool stays focused and practical.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((item) => (
          <article key={item.title} className="cf-card flex flex-col">
            <div
              style={{
                backgroundColor: "var(--accent-soft)",
                color: "var(--accent)",
              }}
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
            >
              <FeatureIcon type={item.icon} />
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p
              style={{ color: "var(--text-muted)" }}
              className="mt-2 text-sm leading-relaxed"
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;