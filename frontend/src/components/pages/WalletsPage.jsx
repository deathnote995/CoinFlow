import { useEffect, useState } from "react";
import AppSidebarShell from "../layout/AppSidebarShell";
import { useDashboardStore } from "../../store/useDashboardStore.js";

const WalletsPage = () => {
  const wallets = useDashboardStore((s) => s.wallets);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const addWallet = useDashboardStore((s) => s.addWallet);

  const [name, setName] = useState("");
  const [type, setType] = useState("Bank");
  const [balance, setBalance] = useState("");
  const [lowThreshold, setLowThreshold] = useState("2000");

  useEffect(() => {
    if (!wallets.length) fetchDashboardData();
  }, [wallets.length, fetchDashboardData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addWallet({ name, type, balance, lowThreshold });
    setName("");
    setBalance("");
  };

  return (
    <AppSidebarShell
      pageTitle="Manage Wallets"
      pageSubtitle="Add wallets, track balances, and monitor low-balance thresholds"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form onSubmit={handleCreate} className="cf-card space-y-4 lg:col-span-4">
          <h2 className="text-lg font-bold">Add New Wallet</h2>
          <input
            type="text"
            required
            placeholder="Wallet name (e.g. SBI Savings)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          >
            <option value="Bank">Bank Account</option>
            <option value="UPI">UPI Wallet</option>
            <option value="Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
          <input
            type="number"
            min="0"
            required
            placeholder="Opening balance (₹)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Low balance alert threshold (₹)"
            value={lowThreshold}
            onChange={(e) => setLowThreshold(e.target.value)}
            style={{ backgroundColor: "var(--bg-app)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          />
          <button type="submit" className="cf-btn-primary w-full text-sm">
            + Create Wallet
          </button>
        </form>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          {wallets.map((w) => {
            const isLow = Number(w.balance) <= Number(w.lowThreshold || 0);
            return (
              <div key={w.id} className="cf-card flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="cf-badge-accent">{w.type}</span>
                    <h3 className="mt-2 text-base font-bold">{w.name}</h3>
                  </div>
                  {isLow && (
                    <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-500">
                      Low Balance
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{Number(w.balance).toLocaleString("en-IN")}</p>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">
                    Alert below ₹{Number(w.lowThreshold || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppSidebarShell>
  );
};

export default WalletsPage;