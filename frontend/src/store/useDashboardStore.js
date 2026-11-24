import { create } from "zustand";
import {
  createTransaction,
  createWallet,
  fetchTransactions,
  fetchWallets,
} from "../services/api.js";

const MAX_FAMILY_MEMBERS = 5;

export function computeDateBounds(dateRange) {
  const ref = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (dateRange.preset === "this-month") {
    return { start: `${ref.getFullYear()}-${pad(ref.getMonth() + 1)}-01`, end: fmt(ref) };
  }
  if (dateRange.preset === "last-30") {
    const start = new Date(ref);
    start.setDate(start.getDate() - 30);
    return { start: fmt(start), end: fmt(ref) };
  }
  if (dateRange.preset === "last-90") {
    const start = new Date(ref);
    start.setDate(start.getDate() - 90);
    return { start: fmt(start), end: fmt(ref) };
  }
  if (dateRange.preset === "custom") {
    return {
      start: dateRange.startDate || "2000-01-01",
      end: dateRange.endDate || "2099-12-31",
    };
  }
  return { start: "2000-01-01", end: "2099-12-31" };
}

export const useDashboardStore = create((set, get) => ({
  maxFamilyMembers: MAX_FAMILY_MEMBERS,

  // Populated dynamically when user logs in / registers / loads profile from API
  currentUser: {
    id: null,
    name: "",
    email: "",
    phNumber: "",
  },

  accountPlan: "individual", // "individual" | "family"
  dashboardView: "personal", // "personal" | "family"

  // Populated dynamically from backend family group
  familyMembers: [],

  wallets: [],
  transactions: [],
  loading: false,
  error: null,
  maximizedChartId: null,

  dateRange: {
    preset: "all",
    startDate: "",
    endDate: "",
  },

  setCurrentUser: (user) =>
    set({
      currentUser: user || { id: null, name: "", email: "" },
      accountPlan: user?.accountPlan || "individual",
      dashboardView: user?.accountPlan === "family" ? "family" : "personal",
    }),

  setFamilyMembers: (members) => set({ familyMembers: Array.isArray(members) ? members : [] }),

  setDashboardView: (view) => {
    if (get().accountPlan !== "family" && view === "family") return;
    set({ dashboardView: view });
  },

  setPreset: (preset) =>
    set((state) => ({
      dateRange: { ...state.dateRange, preset },
    })),

  setCustomDates: (startDate, endDate) =>
    set({
      dateRange: { preset: "custom", startDate, endDate },
    }),

  setMaximizedChartId: (id) => set({ maximizedChartId: id }),

  upgradeToFamilyWithMembers: (newMembersList) => {
    const owner = get().currentUser;
    const cleaned = (newMembersList || [])
      .map((m, idx) => ({
        id: m.id || `member-${idx + 1}`,
        name: (m.name || "").trim(),
        email: (m.email || "").trim(),
        role: "Member",
      }))
      .filter((m) => m.name && m.email);

    if (cleaned.length < 1) {
      return { ok: false, message: "Add at least one family member to upgrade to Family Plan." };
    }

    const ownerEntry = {
      id: owner?.id || "owner",
      name: owner?.name || "Account Owner",
      email: owner?.email || "",
      role: "Owner",
    };

    set({
      accountPlan: "family",
      dashboardView: "family",
      familyMembers: [ownerEntry, ...cleaned].slice(0, MAX_FAMILY_MEMBERS),
    });
    return { ok: true };
  },

  addFamilyMember: ({ name, email }) => {
    const { accountPlan, familyMembers } = get();
    if (accountPlan !== "family") return { ok: false, message: "Upgrade to Family Plan first." };
    if (familyMembers.length >= MAX_FAMILY_MEMBERS) {
      return { ok: false, message: `Maximum ${MAX_FAMILY_MEMBERS} members allowed.` };
    }
    if (!name.trim() || !email.trim()) {
      return { ok: false, message: "Name and email are required." };
    }

    set({
      familyMembers: [
        ...familyMembers,
        {
          id: `member-${familyMembers.length + 1}`,
          name: name.trim(),
          email: email.trim(),
          role: "Member",
        },
      ],
    });
    return { ok: true };
  },

  removeFamilyMember: (memberId) => {
    const { familyMembers, currentUser } = get();
    if (currentUser?.id && memberId === currentUser.id && familyMembers.length > 1) {
      return { ok: false, message: "Owner cannot be removed while other members remain." };
    }
    const remaining = familyMembers.filter((m) => m.id !== memberId);
    if (remaining.length <= 1) {
      const soloList =
        remaining.length === 1
          ? remaining
          : currentUser?.id
            ? [{ ...currentUser, role: "Owner" }]
            : [];
      set({
        familyMembers: soloList,
        accountPlan: "individual",
        dashboardView: "personal",
      });
      return { ok: true, downgraded: true };
    }
    set({ familyMembers: remaining });
    return { ok: true, downgraded: false };
  },

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const [wallets, transactions] = await Promise.all([fetchWallets(), fetchTransactions()]);
      set({ wallets, transactions, loading: false });
    } catch (err) {
      set({
        wallets: [],
        transactions: [],
        loading: false,
        error: err.message || "Unable to connect to API server",
      });
    }
  },

  addTransaction: async (entry) => {
    const { accountPlan, currentUser, familyMembers } = get();
    const isFamily = accountPlan === "family";
    const author =
      isFamily && entry.memberId
        ? familyMembers.find((m) => m.id === entry.memberId) || currentUser
        : currentUser;

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const payload = {
      ...entry,
      time: entry.time || defaultTime,
      memberId: author?.id || null,
      member: author?.name || "Self",
      visibility: isFamily ? entry.visibility || "shared" : "private",
    };

    const saved = await createTransaction(payload);
    set((state) => ({
      transactions: [saved, ...state.transactions],
      wallets: state.wallets.map((w) => {
        if (w.name !== saved.wallet) return w;
        const delta = saved.type === "income" ? Number(saved.amount) : -Number(saved.amount);
        return { ...w, balance: Math.max(0, Number(w.balance) + delta) };
      }),
    }));
  },

  addWallet: async ({ name, type, balance, lowThreshold }) => {
    const payload = {
      name: name.trim(),
      type,
      balance: Number(balance) || 0,
      lowThreshold: Number(lowThreshold) || 1000,
    };
    const saved = await createWallet(payload);
    set((state) => ({ wallets: [...state.wallets, saved] }));
  },
}));