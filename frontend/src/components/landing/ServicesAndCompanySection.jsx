const ServicesAndCompanySection = () => {
  return (
    <section id="services" className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div id="company" className="cf-card">
          <span className="cf-badge-accent">Company</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">About CoinFlow</h2>
          <p style={{ color: "var(--text-muted)" }} className="mt-3 text-sm leading-relaxed">
            CoinFlow is built around a simple idea: money tracking should work whether you manage
            your own wallets solo or share expenses across a household, with clear summaries instead of
            clutter.
          </p>
        </div>

        <div className="cf-card">
          <span className="cf-badge-accent">Services</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">What we offer</h2>
          <ul style={{ color: "var(--text-muted)" }} className="mt-3 space-y-2 text-sm">
            <li>&#8226; Individual &amp; multi-member family expense tracking</li>
            <li>&#8226; Multi-wallet balances, bulk entry &amp; category analytics</li>
            <li>&#8226; Low-balance alerts &amp; upcoming UPI/credit card companion support</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServicesAndCompanySection;