import { useEffect } from "react";
import { Link } from "react-router-dom";
import AppSidebarShell from "../layout/AppSidebarShell";
import { useDashboardStore } from "../../store/useDashboardStore.js";

const ProfileSettingsPage = () => {
  const currentUser = useDashboardStore((s) => s.currentUser);
  const accountPlan = useDashboardStore((s) => s.accountPlan);
  const familyMembers = useDashboardStore((s) => s.familyMembers);
  const wallets = useDashboardStore((s) => s.wallets);
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);

  useEffect(() => {
    if (!wallets.length) fetchDashboardData();
  }, [wallets.length, fetchDashboardData]);

  const isFamily = accountPlan === "family";

  return (
    <AppSidebarShell
      pageTitle="Profile & Plan Settings"
      pageSubtitle="Account profile, plan status, and linked wallet overview"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="cf-card space-y-3 text-sm">
          <span className="cf-badge-accent">Profile</span>
          <h2 className="text-lg font-bold">Account Details</h2>
          <p>
            <strong style={{ color: "var(--text-muted)" }}>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong style={{ color: "var(--text-muted)" }}>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong style={{ color: "var(--text-muted)" }}>Plan:</strong>{" "}
            <span className="uppercase">{accountPlan}</span>
          </p>
        </div>

        <div className="cf-card flex flex-col justify-between space-y-4">
          <div>
            <span className="cf-badge-accent">Plan Action</span>
            <h2 className="mt-2 text-lg font-bold">
              {isFamily ? `Family Group (${familyMembers.length}/5)` : "Solo Individual Account"}
            </h2>
            <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs">
              {isFamily
                ? "Manage household members or downgrade automatically if only 1 member remains."
                : "Add at least 1 family member to upgrade to a Family Plan."}
            </p>
          </div>
          <Link to="/family" className="cf-btn-primary inline-block w-fit text-xs">
            {isFamily ? "Manage Family Members →" : "Upgrade to Family Plan →"}
          </Link>
        </div>
      </div>

      {/* Wallets Overview on Profile Page (with link to /wallets) */}
      <div className="cf-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Wallet Details</h2>
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              Quick look at your active wallets
            </p>
          </div>
          <Link to="/wallets" style={{ color: "var(--accent)" }} className="text-xs font-semibold hover:underline">
            Manage Wallets →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {wallets.map((w) => (
            <div
              key={w.id}
              style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-color)" }}
              className="rounded-xl border p-3.5"
            >
              <p className="text-xs font-semibold">{w.name}</p>
              <p className="mt-1 text-lg font-bold">₹{Number(w.balance).toLocaleString("en-IN")}</p>
              <p style={{ color: "var(--text-muted)" }} className="text-[11px]">
                {w.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppSidebarShell>
  );
};

export default ProfileSettingsPage;