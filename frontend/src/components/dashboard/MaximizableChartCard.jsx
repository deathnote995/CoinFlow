import { useEffect, useState } from "react";
import { useDashboardStore } from "../../store/useDashboardStore.js";

const ExpandIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/**
 * seriesItems: [{ id, label, value, color }]
 * renderChart: (activeSeriesIds, isMaximized) => JSX
 */
const MaximizableChartCard = ({
  chartId,
  title,
  subtitle,
  seriesItems = [],
  renderChart,
  className = "",
}) => {
  const maximizedChartId = useDashboardStore((s) => s.maximizedChartId);
  const setMaximizedChartId = useDashboardStore((s) => s.setMaximizedChartId);

  const isMaximized = maximizedChartId === chartId;
  const [selectedIds, setSelectedIds] = useState(() => seriesItems.map((s) => s.id));

  useEffect(() => {
    setSelectedIds(seriesItems.map((s) => s.id));
  }, [chartId, seriesItems.length]);

  const toggleSeries = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]
    );
  };

  const activeSeries = seriesItems.filter((s) => selectedIds.includes(s.id));
  const values = activeSeries.map((s) => Number(s.value) || 0);
  const total = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  const minVal = count ? Math.min(...values) : 0;
  const maxVal = count ? Math.max(...values) : 0;
  const avgVal = count ? Math.round(total / count) : 0;

  return (
    <>
      <div className={`cf-card flex flex-col justify-between ${className}`}>
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            {subtitle && (
              <p style={{ color: "var(--text-muted)" }} className="text-xs">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMaximizedChartId(chartId)}
            aria-label={`Maximize ${title}`}
            title="Maximize chart"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-color)",
              color: "var(--accent)",
            }}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition hover:opacity-85"
          >
            <ExpandIcon />
          </button>
        </div>

        <div className="w-full">{renderChart(selectedIds, false)}</div>
      </div>

      {/* Maximized Chart + Series Toggles + Summary Stats Table */}
      {isMaximized && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <span className="cf-badge-accent">Expanded View</span>
                <h2 className="mt-1 text-xl font-bold">{title}</h2>
                {subtitle && (
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMaximizedChartId(null)}
                aria-label="Close expanded chart"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border-color)",
                }}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5">{renderChart(selectedIds, true)}</div>

            {/* Series Checkboxes & Stats Breakdown Table */}
            {seriesItems.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <th className="rounded-l-lg px-3 py-2">Show</th>
                      <th className="px-3 py-2">Series / Item</th>
                      <th className="px-3 py-2 text-right">Value (₹)</th>
                      <th className="rounded-r-lg px-3 py-2 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seriesItems.map((item) => {
                      const checked = selectedIds.includes(item.id);
                      const pct = total > 0 && checked ? Math.round((item.value / total) * 100) : 0;
                      return (
                        <tr
                          key={item.id}
                          style={{ borderColor: "var(--border-color)" }}
                          className="border-b"
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSeries(item.id)}
                              className="h-4 w-4 cursor-pointer accent-orange-600"
                            />
                          </td>
                          <td className="px-3 py-2 font-medium">{item.label}</td>
                          <td className="px-3 py-2 text-right font-semibold">
                            ₹{Number(item.value).toLocaleString("en-IN")}
                          </td>
                          <td style={{ color: "var(--text-muted)" }} className="px-3 py-2 text-right">
                            {checked ? `${pct}%` : "Hidden"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border-color)",
                  }}
                  className="mt-4 grid grid-cols-2 gap-3 rounded-xl border p-3 text-xs sm:grid-cols-5"
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Min: </span>
                    <strong>₹{minVal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Max: </span>
                    <strong>₹{maxVal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Avg: </span>
                    <strong>₹{avgVal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Total: </span>
                    <strong>₹{total.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Series: </span>
                    <strong>{count}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MaximizableChartCard;