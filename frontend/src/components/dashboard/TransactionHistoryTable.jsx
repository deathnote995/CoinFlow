import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { computeDateBounds, useDashboardStore } from "../../store/useDashboardStore.js";

const TransactionHistoryTable = () => {
  const transactions = useDashboardStore((s) => s.transactions);
  const wallets = useDashboardStore((s) => s.wallets);
  const dateRange = useDashboardStore((s) => s.dateRange);
  const accountPlan = useDashboardStore((s) => s.accountPlan);
  const dashboardView = useDashboardStore((s) => s.dashboardView);
  const currentUser = useDashboardStore((s) => s.currentUser);
  const familyMembers = useDashboardStore((s) => s.familyMembers);
  const addTransaction = useDashboardStore((s) => s.addTransaction);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food & Dining");
  const [memberId, setMemberId] = useState(currentUser.id);
  const [visibility, setVisibility] = useState("shared"); // "shared" | "private"

  const isFamily = accountPlan === "family";
  const showFamilyFeed = isFamily && dashboardView === "family";

  const recentSix = useMemo(() => {
    const { start, end } = computeDateBounds(dateRange);
    return transactions
      .filter((t) => {
        if (t.date < start || t.date > end) return false;
        const isOwn = t.memberId === currentUser.id || t.member === currentUser.name;
        if (!showFamilyFeed) return isOwn;
        return t.visibility === "shared" || isOwn;
      })
      .slice(0, 6);
  }, [transactions, dateRange, showFamilyFeed, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    await addTransaction({
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      wallet: wallets[0]?.name || "Paytm & GPay UPI",
      memberId: isFamily ? memberId : currentUser.id,
      visibility: isFamily ? visibility : "private",
      date: dateRange.endDate || "2026-11-23",
    });

    setTitle("");
    setAmount("");
  };

  return (
    <section className="cf-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p style={{ color: "var(--text-muted)" }} className="text-xs">
            Latest {recentSix.length} of 6 max items — updates live on every new entry
          </p>
        </div>

        <Link
          to="/transactions"
          style={{ color: "var(--accent)" }}
          className="text-xs font-semibold hover:underline"
        >
          Open monthly statement &rarr;
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--bg-subtle)",
          borderColor: "var(--border-color)",
        }}
        className="grid grid-cols-1 gap-2 rounded-xl border p-3 sm:grid-cols-2 lg:grid-cols-7"
      >
        <input
          type="text"
          placeholder="Description"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-main)",
          }}
          className="rounded-lg border px-3 py-1.5 text-xs lg:col-span-2"
        />

        <input
          type="number"
          min="1"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-main)",
          }}
          className="rounded-lg border px-3 py-1.5 text-xs"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-main)",
          }}
          className="rounded-lg border px-3 py-1.5 text-xs"
        >
          <option value="Food & Dining">Food &amp; Dining</option>
          <option value="Groceries">Groceries</option>
          <option value="Rent & Bills">Rent &amp; Bills</option>
          <option value="Commute">Commute</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
        </select>

        {isFamily && (
          <>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="rounded-lg border px-3 py-1.5 text-xs"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              title="WhatsApp status style visibility"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              className="rounded-lg border px-3 py-1.5 text-xs"
            >
              <option value="shared">Shared (Family)</option>
              <option value="private">Only Me (Private)</option>
            </select>
          </>
        )}

        <button type="submit" className="cf-btn-primary text-xs">
          + Add
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-muted)",
              }}
            >
              <th className="rounded-l-lg px-3 py-2">Date</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Category</th>
              {isFamily && <th className="px-3 py-2">Member</th>}
              {isFamily && <th className="px-3 py-2">Visibility</th>}
              <th className="rounded-r-lg px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentSix.map((tx) => {
              const isIncome = tx.type === "income";
              return (
                <tr
                  key={tx.id}
                  style={{ borderColor: "var(--border-color)" }}
                  className="border-b"
                >
                  <td style={{ color: "var(--text-muted)" }} className="px-3 py-2.5 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="px-3 py-2.5 font-medium">{tx.title}</td>
                  <td className="px-3 py-2.5">
                    <span className="cf-badge-accent">{tx.category}</span>
                  </td>
                  {isFamily && <td className="px-3 py-2.5">{tx.member}</td>}
                  {isFamily && (
                    <td style={{ color: "var(--text-muted)" }} className="px-3 py-2.5 text-xs">
                      {tx.visibility === "private" ? "Only Me" : "Shared"}
                    </td>
                  )}
                  <td
                    style={{ color: isIncome ? "#16a34a" : "var(--accent)" }}
                    className="px-3 py-2.5 text-right font-semibold whitespace-nowrap"
                  >
                    {isIncome ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionHistoryTable;