import { useMemo } from "react";
import { computeDateBounds, useDashboardStore } from "../../store/useDashboardStore.js";
import MaximizableChartCard from "./MaximizableChartCard";

const PIE_COLORS = ["#ea580c", "#f97316", "#16a34a", "#0284c7", "#9333ea", "#ca8a04"];

const DonutChartSvg = ({ items, size = 144 }) => {
  const total = items.reduce((s, x) => s + (Number(x.value) || 0), 0);
  if (!total) {
    return (
      <p style={{ color: "var(--text-muted)" }} className="py-6 text-center text-xs">
        No data in selected window.
      </p>
    );
  }

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <svg
        viewBox="0 0 140 140"
        style={{ width: size, height: size }}
        className="shrink-0"
        role="img"
        aria-label="Pie distribution chart"
      >
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--bg-subtle)" strokeWidth="18" />
        {items.map((item, idx) => {
          const share = (Number(item.value) || 0) / total;
          const dash = share * circumference;
          const strokeDashoffset = -offsetAcc;
          offsetAcc += dash;
          return (
            <circle
              key={item.id}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={PIE_COLORS[idx % PIE_COLORS.length]}
              strokeWidth="18"
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 70 70)"
            />
          );
        })}
        <text x="70" y="74" textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="700">
          ₹{Math.round(total / 1000)}k
        </text>
      </svg>

      <div className="w-full space-y-1.5 text-xs">
        {items.map((item, idx) => {
          const pct = Math.round(((Number(item.value) || 0) / total) * 100);
          return (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                />
                <span className="truncate font-medium">{item.label}</span>
              </div>
              <span style={{ color: "var(--text-muted)" }} className="whitespace-nowrap">
                ₹{Number(item.value).toLocaleString("en-IN")} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnalyticsChartsGrid = () => {
  const transactions = useDashboardStore((s) => s.transactions);
  const wallets = useDashboardStore((s) => s.wallets);
  const dateRange = useDashboardStore((s) => s.dateRange);
  const accountPlan = useDashboardStore((s) => s.accountPlan);
  const dashboardView = useDashboardStore((s) => s.dashboardView);
  const currentUser = useDashboardStore((s) => s.currentUser);

  const showFamilyBifurcation = accountPlan === "family" && dashboardView === "family";

  // const visibleTx = useMemo(() => {
  //   const { start, end } = computeDateBounds(dateRange);
  //   return transactions.filter((t) => {
  //     if (t.date < start || t.date > end) return false;
  //     const isOwn = t.memberId === currentUser.id || t.member === currentUser.name;
  //     if (!showFamilyBifurcation) return isOwn;
  //     return t.visibility === "shared" || isOwn;
  //   });
  // }, [transactions, dateRange, showFamilyBifurcation, currentUser]);

  const visibleTx = useMemo(() => {
    const { start, end } = computeDateBounds(dateRange);
    return transactions.filter((t) => {
      if (t.date < start || t.date > end) return false;
      const isOwn = t.memberId === currentUser.id || t.member === currentUser.name || (!t.memberId && t.member === "Self");
      const effectiveVisibility = t.visibility || "shared";
      if (!showFamilyBifurcation) return isOwn;
      return effectiveVisibility === "shared" || isOwn;
    });
  }, [transactions, dateRange, showFamilyBifurcation, currentUser]);

  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap = {};
    const memMap = {};
    const monthMap = {};
    const personalWalletMap = {};

    for (const tx of visibleTx) {
      const amt = Number(tx.amount) || 0;
      const mKey = (tx.date || "2026-11-01").slice(0, 7);
      if (tx.type === "income") {
        income += amt;
      }
      else if (tx.type === "expense") {
        const wName = tx.wallet || "Other Wallet"
        personalWalletMap[wName] = (personalWalletMap[wName] || 0) + amt;
        expense += amt;
        catMap[tx.category] = (catMap[tx.category] || 0) + amt;
        memMap[tx.member || currentUser.name] = (memMap[tx.member || currentUser.name] || 0) + amt;
        monthMap[mKey] = (monthMap[mKey] || 0) + amt;
      }
    }

    return {
      totalBalance: wallets.reduce((s, w) => s + (Number(w.balance) || 0), 0),
      income,
      expense,
      categorySeries: Object.entries(catMap).map(([label, value], i) => ({
        id: `c-${i}`,
        label,
        value,
      })),
      memberSeries: Object.entries(memMap).map(([label, value], i) => ({
        id: `m-${i}`,
        label,
        value,
      })),
      walletSeries: wallets.map((w) => ({
        id: w.id,
        label: w.name,
        value: Number(w.balance) || 0,
      })),
      monthSeries: Object.entries(monthMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([label, value], i) => ({ id: `mo-${i}`, label, value })),
      personalWalletSpendSeries: Object.entries(personalWalletMap).map(([label, value], i) => ({
        id: `pw-${i}`,
        label,
        value,
      })),
    };
  }, [visibleTx, wallets, currentUser.name]);

  const maxWallet = Math.max(1, ...metrics.walletSeries.map((w) => w.value));

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="cf-card">
          <p style={{ color: "var(--text-muted)" }} className="text-xs font-medium">
            Total Wallet Balance
          </p>
          <p className="mt-1 text-2xl font-bold">₹{metrics.totalBalance.toLocaleString("en-IN")}</p>
        </div>
        <div className="cf-card">
          <p style={{ color: "var(--text-muted)" }} className="text-xs font-medium">
            {showFamilyBifurcation ? "Family Inflow" : "My Inflow"}
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +₹{metrics.income.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="cf-card">
          <p style={{ color: "var(--text-muted)" }} className="text-xs font-medium">
            {showFamilyBifurcation ? "Cumulative Family Spend" : "My Spend"}
          </p>
          <p style={{ color: "var(--accent)" }} className="mt-1 text-2xl font-bold">
            -₹{metrics.expense.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="cf-card">
          <p style={{ color: "var(--text-muted)" }} className="text-xs font-medium">
            Visible Entries
          </p>
          <p className="mt-1 text-2xl font-bold">{visibleTx.length}</p>
        </div>
      </div>

      {/* Bento Row 1: 3 Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MaximizableChartCard
          chartId="thick-bars"
          title="Income vs. Expense"
          subtitle="Thick column comparison"
          seriesItems={[
            { id: "inc", label: "Income", value: metrics.income },
            { id: "exp", label: "Expense", value: metrics.expense },
          ]}
          renderChart={(selectedIds, expanded) => {
            const maxVal = Math.max(1, metrics.income, metrics.expense);
            const bars = [
              { id: "inc", label: "Income", value: metrics.income, color: "#16a34a" },
              { id: "exp", label: "Expense", value: metrics.expense, color: "var(--accent)" },
            ].filter((b) => selectedIds.includes(b.id));

            return (
              <svg
                viewBox="0 0 380 180"
                className={expanded ? "h-72 w-full" : "h-44 w-full"}
                role="img"
                aria-label="Income versus expense bar chart"
              >
                <line x1="16" y1="145" x2="364" y2="145" stroke="var(--border-color)" strokeWidth="2" />
                {bars.map((bar, idx) => {
                  const h = Math.max(10, Math.round((bar.value / maxVal) * 110));
                  const x = bars.length === 1 ? 140 : 65 + idx * 145;
                  const y = 145 - h;
                  return (
                    <g key={bar.id}>
                      <rect x={x} y={y} width="92" height={h} rx="10" fill={bar.color} />
                      <text
                        x={x + 46}
                        y={y - 7}
                        textAnchor="middle"
                        fill="var(--text-main)"
                        fontSize="11"
                        fontWeight="700"
                      >
                        ₹{bar.value.toLocaleString("en-IN")}
                      </text>
                      <text x={x + 46} y="166" textAnchor="middle" fill="var(--text-muted)" fontSize="11">
                        {bar.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            );
          }}
        />

        <MaximizableChartCard
          chartId="category-pie"
          title="Category Distribution"
          subtitle="Pie share by expense category"
          seriesItems={metrics.categorySeries}
          renderChart={(selectedIds, expanded) => (
            <DonutChartSvg
              items={metrics.categorySeries.filter((c) => selectedIds.includes(c.id))}
              size={expanded ? 210 : 142}
            />
          )}
        />

        <MaximizableChartCard
          chartId="monthly-line"
          title="Monthly Expense Line"
          subtitle="Spend trajectory across months"
          seriesItems={metrics.monthSeries}
          renderChart={(selectedIds, expanded) => {
            const pts = metrics.monthSeries.filter((m) => selectedIds.includes(m.id));
            if (!pts.length) {
              return (
                <p style={{ color: "var(--text-muted)" }} className="py-6 text-center text-xs">
                  No monthly data in range.
                </p>
              );
            }
            const maxV = Math.max(1, ...pts.map((p) => p.value));
            const coords = pts
              .map((p, idx) => {
                const x = pts.length === 1 ? 190 : 40 + (idx / (pts.length - 1)) * 300;
                const y = 135 - (p.value / maxV) * 100;
                return { ...p, x, y };
              });
            return (
              <svg
                viewBox="0 0 380 175"
                className={expanded ? "h-72 w-full" : "h-44 w-full"}
                role="img"
                aria-label="Monthly expense line chart"
              >
                <polyline
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
                />
                {coords.map((c) => (
                  <g key={c.id}>
                    <circle cx={c.x} cy={c.y} r="4.5" fill="var(--accent)" />
                    <text x={c.x} y="162" textAnchor="middle" fill="var(--text-muted)" fontSize="11">
                      {c.label}
                    </text>
                  </g>
                ))}
              </svg>
            );
          }}
        />
      </div>

      {/* Bento Row 2: 3 Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MaximizableChartCard
          chartId="wallets-bars"
          title="Wallet Balances"
          subtitle="Current funds by wallet"
          seriesItems={metrics.walletSeries}
          renderChart={(selectedIds, expanded) => {
            const visible = metrics.walletSeries.filter((w) => selectedIds.includes(w.id));
            return (
              <div className={expanded ? "space-y-4 py-2" : "space-y-3"}>
                {visible.map((w) => (
                  <div key={w.id}>
                    <div className="mb-1 flex justify-between text-xs font-medium">
                      <span>{w.label}</span>
                      <span>₹{w.value.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ backgroundColor: "var(--bg-subtle)" }} className="h-3 w-full overflow-hidden rounded-full">
                      <div
                        style={{
                          width: `${Math.round((w.value / maxWallet) * 100)}%`,
                          backgroundColor: "var(--accent)",
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        />

        {showFamilyBifurcation ? (
          <MaximizableChartCard
            chartId="member-pie"
            title="Per-Member Bifurcation"
            subtitle="Cumulative family spend per member"
            seriesItems={metrics.memberSeries}
            renderChart={(selectedIds, expanded) => (
              <DonutChartSvg
                items={metrics.memberSeries.filter((m) => selectedIds.includes(m.id))}
                size={expanded ? 210 : 142}
              />
            )}
          />
        ) : (
          // <MaximizableChartCard
          //   chartId="solo-mode-card"
          //   title="Individual Account Mode"
          //   subtitle="Personal transactions only"
          //   seriesItems={metrics.categorySeries}
          //   renderChart={() => (
          //     <div className="space-y-2 py-2 text-xs">
          //       <p style={{ color: "var(--text-muted)" }} className="leading-relaxed">
          //         You are viewing your personal account. Upgrade to a Family Plan in Profile &amp;
          //         Plan to add members and compare per-member spend.
          //       </p>
          //     </div>
          //   )}
          // />
          <MaximizableChartCard
            chartId="personal-wallet-pie"
            title="Personal Spend by Wallet"
            subtitle="How your personal expenses split across wallets"
            seriesItems={metrics.personalWalletSpendSeries}
            renderChart={(selectedIds, expanded) => (
              <DonutChartSvg
                items={metrics.personalWalletSpendSeries.filter((w) => selectedIds.includes(w.id))}
                size={expanded ? 210 : 142}
              />
            )}
          />
        )}

        <MaximizableChartCard
          chartId="top-categories-bars"
          title="Top Categories (Thick Bars)"
          subtitle="Highest spend categories"
          seriesItems={metrics.categorySeries.slice(0, 4)}
          renderChart={(selectedIds, expanded) => {
            const items = metrics.categorySeries
              .filter((c) => selectedIds.includes(c.id))
              .slice(0, 4);
            const maxC = Math.max(1, ...items.map((x) => x.value));
            if (!items.length) {
              return (
                <p style={{ color: "var(--text-muted)" }} className="py-6 text-center text-xs">
                  No category spend in range.
                </p>
              );
            }
            return (
              <svg
                viewBox="0 0 380 180"
                className={expanded ? "h-72 w-full" : "h-44 w-full"}
                role="img"
                aria-label="Top categories bar chart"
              >
                <line x1="16" y1="145" x2="364" y2="145" stroke="var(--border-color)" strokeWidth="2" />
                {items.map((cat, i) => {
                  const h = Math.max(10, Math.round((cat.value / maxC) * 105));
                  const slot = 340 / items.length;
                  const x = 20 + i * slot + slot * 0.2;
                  const w = Math.max(28, slot * 0.6);
                  return (
                    <g key={cat.id}>
                      <rect x={x} y={145 - h} width={w} height={h} rx="7" fill="var(--accent)" />
                      <text x={x + w / 2} y="165" textAnchor="middle" fill="var(--text-muted)" fontSize="10">
                        {cat.label.slice(0, 9)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsChartsGrid;