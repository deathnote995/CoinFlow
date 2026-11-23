import { useState } from "react";
import AppSidebarShell from "../layout/AppSidebarShell";
import { useDashboardStore } from "../../store/useDashboardStore.js";

const FamilyMembersPage = () => {
  const accountPlan = useDashboardStore((s) => s.accountPlan);
  const familyMembers = useDashboardStore((s) => s.familyMembers);
  const maxFamilyMembers = useDashboardStore((s) => s.maxFamilyMembers);
  const currentUser = useDashboardStore((s) => s.currentUser);
  const addFamilyMember = useDashboardStore((s) => s.addFamilyMember);
  const removeFamilyMember = useDashboardStore((s) => s.removeFamilyMember);
  const upgradeToFamilyWithMembers = useDashboardStore((s) => s.upgradeToFamilyWithMembers);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  // Mandatory member list when upgrading an Individual plan to Family
  const [upgradeDrafts, setUpgradeDrafts] = useState([{ name: "", email: "" }]);

  const handleAdd = (e) => {
    e.preventDefault();
    const res = addFamilyMember({ name, email });
    setFeedback(res.message || "Member added to family group.");
    if (res.ok) {
      setName("");
      setEmail("");
    }
  };

  const handleRemoveWithConfirm = (member) => {
    const isLastOther = familyMembers.length === 2 && member.id !== currentUser.id;
    const msg = isLastOther
      ? `Remove ${member.name}? Since you will be the only member left, your account will automatically downgrade to Individual Plan.`
      : `Are you sure you want to remove ${member.name} from the family group?`;

    if (!window.confirm(msg)) return;

    const res = removeFamilyMember(member.id);
    if (res.downgraded) {
      setFeedback("All other members removed — account automatically downgraded to Individual Plan.");
    } else if (!res.ok) {
      setFeedback(res.message);
    } else {
      setFeedback(`${member.name} removed.`);
    }
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    const res = upgradeToFamilyWithMembers(upgradeDrafts);
    setFeedback(res.message || "Upgraded to Family Plan!");
    if (res.ok) {
      setUpgradeDrafts([{ name: "", email: "" }]);
    }
  };

  if (accountPlan === "individual") {
    return (
      <AppSidebarShell
        pageTitle="Upgrade to Family Plan"
        pageSubtitle="Add at least one family member with their name and email to unlock shared tracking"
      >
        <div className="cf-card max-w-2xl space-y-5">
          <div>
            <span className="cf-badge-accent">Individual Plan Active</span>
            <h2 className="mt-2 text-xl font-bold">Add Family Members to Upgrade</h2>
            <p style={{ color: "var(--text-muted)" }} className="mt-1 text-xs sm:text-sm">
              To switch from Individual to Family Plan, you must register at least 1 additional
              member (up to {maxFamilyMembers} total members in the household).
            </p>
          </div>

          <form onSubmit={handleUpgradeSubmit} className="space-y-4">
            {upgradeDrafts.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Member name"
                  value={row.name}
                  onChange={(e) => {
                    const next = [...upgradeDrafts];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setUpgradeDrafts(next);
                  }}
                  style={{
                    backgroundColor: "var(--bg-app)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-main)",
                  }}
                  className="rounded-lg border px-3.5 py-2 text-sm"
                />
                <input
                  type="email"
                  required
                  placeholder="Member email"
                  value={row.email}
                  onChange={(e) => {
                    const next = [...upgradeDrafts];
                    next[idx] = { ...next[idx], email: e.target.value };
                    setUpgradeDrafts(next);
                  }}
                  style={{
                    backgroundColor: "var(--bg-app)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-main)",
                  }}
                  className="rounded-lg border px-3.5 py-2 text-sm"
                />
              </div>
            ))}

            {upgradeDrafts.length < maxFamilyMembers - 1 && (
              <button
                type="button"
                onClick={() => setUpgradeDrafts((d) => [...d, { name: "", email: "" }])}
                style={{ borderColor: "var(--border-color)" }}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold"
              >
                + Another Member Slot
              </button>
            )}

            {feedback && (
              <p style={{ color: "var(--accent)" }} className="text-xs font-semibold">
                {feedback}
              </p>
            )}

            <button type="submit" className="cf-btn-primary text-sm">
              Complete Upgrade to Family Plan
            </button>
          </form>
        </div>
      </AppSidebarShell>
    );
  }

  return (
    <AppSidebarShell
      pageTitle="Family Group Members"
      pageSubtitle={`Managing ${familyMembers.length} of ${maxFamilyMembers} allowed household accounts`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleAdd} className="cf-card space-y-4">
          <h2 className="text-lg font-bold">Add Member to Family Group</h2>
          <input
            type="text"
            required
            placeholder="Member full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              backgroundColor: "var(--bg-app)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          />
          <input
            type="email"
            required
            placeholder="Member email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "var(--bg-app)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="w-full rounded-lg border px-3.5 py-2 text-sm"
          />
          {feedback && (
            <p style={{ color: "var(--accent)" }} className="text-xs font-semibold">
              {feedback}
            </p>
          )}
          <button
            type="submit"
            disabled={familyMembers.length >= maxFamilyMembers}
            className="cf-btn-primary text-sm disabled:opacity-50"
          >
            + Add Member
          </button>
        </form>

        <div className="cf-card space-y-3">
          <h2 className="text-lg font-bold">Members in Family Account</h2>
          <p style={{ color: "var(--text-muted)" }} className="text-xs">
            Removing every other member automatically downgrades this account to Individual.
          </p>
          <ul className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {familyMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">
                    {member.email} · {member.role}
                  </p>
                </div>

                {member.id !== currentUser.id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWithConfirm(member)}
                    style={{ borderColor: "var(--border-color)", color: "#dc2626" }}
                    className="cursor-pointer rounded-lg border px-3 py-1 text-xs font-semibold hover:opacity-80"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppSidebarShell>
  );
};

export default FamilyMembersPage;