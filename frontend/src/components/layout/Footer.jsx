const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
      className="border-t pt-12 pb-8"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            href="#top"
            style={{ color: "var(--accent)" }}
            className="text-xl font-bold tracking-tight"
          >
            CoinFlow
          </a>
          <p style={{ color: "var(--text-muted)" }} className="mt-3 text-sm leading-relaxed">
            Personal and family expense tracking across multiple wallets, categories, and monthly
            views.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
          <ul style={{ color: "var(--text-muted)" }} className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#analytics" className="hover:underline">
                Analytics
              </a>
            </li>
            <li>
              <a href="#companion" className="hover:underline">
                Mobile Companion
              </a>
            </li>
            <li>
              <a href="#security" className="hover:underline">
                Security
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
          <ul style={{ color: "var(--text-muted)" }} className="mt-3 space-y-2 text-sm">
            <li>Email: support@coinflow.app</li>
            <li>Phone: +91 98000 00000</li>
            <li>
              <a href="#company" className="hover:underline">
                About &amp; Services
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Address</h3>
          <address
            style={{ color: "var(--text-muted)" }}
            className="mt-3 not-italic text-sm leading-relaxed"
          >
            CoinFlow HQ
            <br />
            Sector 21, Faridabad, Haryana
            <br />
            India
          </address>
        </div>
      </div>

      <div
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-muted)",
        }}
        className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-t px-6 pt-6 text-xs sm:flex-row"
      >
        <p>All rights reserved &copy; {new Date().getFullYear()} CoinFlow</p>
        <p>Individual &amp; Family Expense Tracking</p>
      </div>
    </footer>
  );
};

export default Footer;