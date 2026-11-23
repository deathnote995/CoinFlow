import { useEffect, useMemo, useState } from "react";
import AppSidebarShell from "../layout/AppSidebarShell";
import { useDashboardStore } from "../../store/useDashboardStore.js";

function formatMonthHeading(yyyyMm) {
  const [year, month] = yyyyMm.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

const TransactionsHistoryPage = () => {
  const transactions = useDashboardStore((s) => s.transactions);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const planType = useDashboardStore((s) => s.accountPlan);

  // Scoped strictly to /transactions page (date + time filter)
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSource, setUploadSource] = useState("device"); // "device" | "cloud" | "drive"
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (!transactions.length) {
      fetchDashboardData();
    }
  }, [transactions.length, fetchDashboardData]);

  const dateTimeFiltered = useMemo(() => {
    return transactions.filter((tx) => {
      const txStamp = `${tx.date || "2026-11-01"}T${tx.time || "00:00"}`;
      if (startDateTime && txStamp < startDateTime) return false;
      if (endDateTime && txStamp > endDateTime) return false;
      return true;
    });
  }, [transactions, startDateTime, endDateTime]);

  const groupedByMonth = useMemo(() => {
    const map = {};
    for (const tx of dateTimeFiltered) {
      const key = (tx.date || "2026-11-01").slice(0, 7);
      if (!map[key]) map[key] = [];
      map[key].push(tx);
    }
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [dateTimeFiltered]);

  const handleStatementSubmit = (e) => {
    e.preventDefault();
    setUploadStatus(
      `Statement queued from ${
        uploadSource === "device" ? "This Device" : uploadSource === "cloud" ? "Cloud Storage" : "Google Drive"
      }${fileName ? ` (${fileName})` : ""}. Backend parser endpoint will process this once connected.`
    );
  };

  return (
    <AppSidebarShell
      pageTitle="Transaction Statement by Month"
      pageSubtitle="Grouped month by month with page-level date-time filtering and statement upload"
    >
      {/* Page-Only Date-Time Filter + Upload Bank Statement Button */}
      <div className="cf-card flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold">From Date &amp; Time</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
              className="rounded-lg border px-3 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">To Date &amp; Time</label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
              className="rounded-lg border px-3 py-1.5 text-xs"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setStartDateTime("");
                setEndDateTime("");
              }}
              style={{ borderColor: "var(--border-color)" }}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold"
            >
              Reset Date-Time
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setUploadStatus("");
            setUploadModalOpen(true);
          }}
          className="cf-btn-primary shrink-0 text-xs"
        >
          + Upload Bank Statement
        </button>
      </div>

      {/* Month-by-Month Grouped Feed */}
      {groupedByMonth.length === 0 ? (
        <div className="cf-card text-center text-sm">
          No transactions match this filter or API data yet.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByMonth.map(([monthKey, items]) => {
            const monthExpense = items
              .filter((i) => i.type === "expense")
              .reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
            const monthIncome = items
              .filter((i) => i.type === "income")
              .reduce((acc, i) => acc + (Number(i.amount) || 0), 0);

            return (
              <section key={monthKey} className="cf-card space-y-4">
                <div
                  style={{ borderColor: "var(--border-color)" }}
                  className="flex flex-wrap items-center justify-between gap-2 border-b pb-3"
                >
                  <div>
                    <h2 className="text-lg font-bold">{formatMonthHeading(monthKey)}</h2>
                    <p style={{ color: "var(--text-muted)" }} className="text-xs">
                      {items.length} transactions
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Inflow: +₹{monthIncome.toLocaleString("en-IN")}
                    </span>
                    <span style={{ color: "var(--accent)" }}>
                      Spend: -₹{monthExpense.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {items.map((tx) => {
                    const isIncome = tx.type === "income";
                    return (
                      <div key={tx.id} className="flex items-center justify-between gap-4 py-3 text-xs sm:text-sm">
                        <div>
                          <p className="font-semibold">{tx.title}</p>
                          <p style={{ color: "var(--text-muted)" }} className="text-xs">
                            {tx.date} {tx.time ? `· ${tx.time}` : ""} · {tx.category} · {tx.wallet}
                            {planType === "family" ? ` · ${tx.member || "Self"}` : ""}
                          </p>
                        </div>
                        <span
                          style={{ color: isIncome ? "#16a34a" : "var(--accent)" }}
                          className="font-bold whitespace-nowrap"
                        >
                          {isIncome ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Upload Bank Statement Popup Modal */}
      {uploadModalOpen && (
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold">Upload Bank Statement</h2>
            <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs">
              Choose where to import your statement PDF or CSV from.
            </p>

            <form onSubmit={handleStatementSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "device", label: "This Device" },
                  { id: "cloud", label: "Cloud" },
                  { id: "drive", label: "Google Drive" },
                ].map((src) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setUploadSource(src.id)}
                    style={{
                      backgroundColor: uploadSource === src.id ? "var(--accent-soft)" : "var(--bg-app)",
                      borderColor: uploadSource === src.id ? "var(--accent)" : "var(--border-color)",
                      color: uploadSource === src.id ? "var(--accent)" : "var(--text-main)",
                    }}
                    className="cursor-pointer rounded-lg border py-2 font-semibold"
                  >
                    {src.label}
                  </button>
                ))}
              </div>

              {uploadSource === "device" ? (
                <input
                  type="file"
                  accept=".csv,.pdf,.xlsx"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)" }}
                  className="w-full rounded-lg border p-2 text-xs"
                />
              ) : (
                <input
                  type="text"
                  placeholder={
                    uploadSource === "cloud"
                      ? "Paste cloud file link or path"
                      : "Paste Google Drive share link"
                  }
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
                  className="w-full rounded-lg border px-3 py-2 text-xs"
                />
              )}

              {uploadStatus && (
                <p style={{ color: "var(--accent)" }} className="text-xs font-medium">
                  {uploadStatus}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  style={{ borderColor: "var(--border-color)" }}
                  className="cursor-pointer rounded-lg border px-4 py-2 text-xs font-semibold"
                >
                  Close
                </button>
                <button type="submit" className="cf-btn-primary text-xs">
                  Import Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppSidebarShell>
  );
};

export default TransactionsHistoryPage;