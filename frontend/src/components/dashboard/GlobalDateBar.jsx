import { computeDateBounds, useDashboardStore } from "../../store/useDashboardStore.js";

const PRESETS = [
  { id: "this-month", label: "This Month" },
  { id: "last-30", label: "Last 30 Days" },
  { id: "last-90", label: "Last 90 Days" },
  { id: "all", label: "All Time" },
];

const GlobalDateBar = () => {
  const dateRange = useDashboardStore((s) => s.dateRange);
  const setPreset = useDashboardStore((s) => s.setPreset);
  const setCustomDates = useDashboardStore((s) => s.setCustomDates);
  const loading = useDashboardStore((s) => s.loading);
  const error = useDashboardStore((s) => s.error);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);

  const bounds = computeDateBounds(dateRange);

  const statusLabel = loading
    ? "Loading..."
    : error
      ? "API Offline (Retry)"
      : "API :3001 Connected";

  const statusColor = loading
    ? "var(--text-muted)"
    : error
      ? "#dc2626"
      : "#16a34a";

  return (
    <div className="cf-card flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="cf-badge-accent">Global Date Filter</span>
          <span
            style={{ color: "var(--text-muted)" }}
            className="text-xs font-medium"
          >
            Active Window: {bounds.start} &rarr; {bounds.end}
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs">
          Changing this range updates every chart, summary metric, and transaction row below.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => {
          const active = dateRange.preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              style={{
                backgroundColor: active ? "var(--accent)" : "var(--bg-subtle)",
                color: active ? "var(--accent-text)" : "var(--text-main)",
                borderColor: active ? "var(--accent)" : "var(--border-color)",
              }}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            >
              {p.label}
            </button>
          );
        })}

        <div className="flex items-center gap-1.5 text-xs">
          <input
            type="date"
            aria-label="Start date"
            value={dateRange.startDate}
            onChange={(e) => setCustomDates(e.target.value, dateRange.endDate)}
            style={{
              backgroundColor: "var(--bg-app)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="rounded-lg border px-2 py-1 text-xs"
          />
          <span style={{ color: "var(--text-muted)" }}>to</span>
          <input
            type="date"
            aria-label="End date"
            value={dateRange.endDate}
            onChange={(e) => setCustomDates(dateRange.startDate, e.target.value)}
            style={{
              backgroundColor: "var(--bg-app)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="rounded-lg border px-2 py-1 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          title={error || "Refresh data from API"}
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderColor: "var(--border-color)",
            color: statusColor,
          }}
          className="cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          {statusLabel}
        </button>
      </div>
    </div>
  );
};

export default GlobalDateBar;