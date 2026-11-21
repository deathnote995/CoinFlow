const SECURITY_POINTS = [
  {
    title: "Account & Member Scoping",
    detail:
      "Data stays scoped to your individual account or your approved household members, keeping unrelated users isolated.",
  },
  {
    title: "Controlled Sharing & Visibility",
    detail:
      "Family account members can view shared transactions and cumulative totals without exposing outside accounts.",
  },
  {
    title: "Privacy-First Tracking",
    detail:
      "Focused purely on personal and household expense visibility rather than ad profiling or third-party data brokerage.",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="max-w-2xl">
        <span className="cf-badge-accent">Security</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Structured boundaries for personal and shared records
        </h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-2 text-sm sm:text-base">
          Clear access rules so individual and family tracking stay organized and trustworthy.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {SECURITY_POINTS.map((item) => (
          <div key={item.title} className="cf-card">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p style={{ color: "var(--text-muted)" }} className="mt-2 text-sm leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SecuritySection;