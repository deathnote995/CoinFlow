const MONTHLY_DATA = [
  { month: "Jun", amount: 18400, ratio: 0.45 },
  { month: "Jul", amount: 27800, ratio: 0.68 },
  { month: "Aug", amount: 21200, ratio: 0.52 },
  { month: "Sep", amount: 31900, ratio: 0.78 },
  { month: "Oct", amount: 24600, ratio: 0.6 },
  { month: "Nov", amount: 34200, ratio: 0.84 },
];

const CATEGORIES = [
  { name: "Food & Dining", share: 36 },
  { name: "Bills & Utilities", share: 28 },
  { name: "Travel & Commute", share: 20 },
  { name: "Shopping & Other", share: 16 },
];

const AnalyticsPreviewSection = () => {
  const chartWidth = 480;
  const chartHeight = 195;
  const bottomY = 162;
  const maxBarHeight = 126;
  const colWidth = chartWidth / MONTHLY_DATA.length;

  const points = MONTHLY_DATA.map((d, idx) => {
    const x = idx * colWidth + colWidth / 2;
    const barH = Math.round(d.ratio * maxBarHeight);
    const y = bottomY - barH;
    return { ...d, x, y, barH };
  });

  const linePath = points
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y - 8}`)
    .join(" ");

  return (
    <section id="analytics" className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="max-w-2xl">
        <span className="cf-badge-accent">Analytics</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Visual graphs that show where cash moves
        </h2>
        <p style={{ color: "var(--text-muted)" }} className="mt-2 text-sm sm:text-base">
          Compare monthly spending trends and see which categories take the largest share.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="cf-card lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Monthly Expense Trend</h3>
            <span style={{ color: "var(--text-muted)" }} className="text-xs">
              Last 6 Months (Sample View)
            </span>
          </div>

          <div className="mt-4 w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-52 w-full min-w-[340px]"
              role="img"
              aria-label="Monthly expense trend bar and line chart"
            >
              <line
                x1="16"
                y1={bottomY}
                x2={chartWidth - 16}
                y2={bottomY}
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />

              {points.map((pt) => (
                <g key={pt.month}>
                  <rect
                    x={pt.x - 18}
                    y={pt.y}
                    width="36"
                    height={pt.barH}
                    rx="6"
                    fill="var(--accent)"
                    opacity="0.92"
                  />
                  <text
                    x={pt.x}
                    y={bottomY + 20}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="12"
                  >
                    {pt.month}
                  </text>
                </g>
              ))}

              <path
                d={linePath}
                fill="none"
                stroke="var(--text-main)"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {points.map((pt) => (
                <circle
                  key={`${pt.month}-dot`}
                  cx={pt.x}
                  cy={pt.y - 8}
                  r="3.5"
                  fill="var(--bg-surface)"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="cf-card lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Spending by Category</h3>
            <span className="cf-badge-accent">This Month</span>
          </div>

          <div className="mt-6 space-y-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span style={{ color: "var(--text-muted)" }}>{cat.share}%</span>
                </div>
                <div
                  style={{ backgroundColor: "var(--bg-subtle)" }}
                  className="h-2.5 w-full overflow-hidden rounded-full"
                >
                  <div
                    style={{
                      width: `${cat.share}%`,
                      backgroundColor: "var(--accent)",
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPreviewSection;