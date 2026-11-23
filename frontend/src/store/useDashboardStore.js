import { create } from "zustand";
import {
  createTransaction,
  createWallet,
  fetchTransactions,
  fetchWallets,
} from "../services/api.js";

const MAX_FAMILY_MEMBERS = 5;

export function computeDateBounds(dateRange) {
  const ref = new Date("2026-11-23T23:59:59");
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (dateRange.preset === "this-month") {
    return { start: "2026-11-01", end: fmt(ref) };
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
  currentUser: {
    id: "u1",
    name: "Rajat Chowdhury",
    email: "rajat@coinflow.app",
  },
  accountPlan: "family", // "individual" | "family"
  dashboardView: "family", // "personal" | "family"
  familyMembers: [
    { id: "u1", name: "Rajat Chowdhury", email: "rajat@coinflow.app", role: "Owner" },
    { id: "u2", name: "Priya", email: "priya@coinflow.app", role: "Member" },
    { id: "u3", name: "Dad", email: "dad@coinflow.app", role: "Member" },
  ],
  wallets: [],
  transactions: [],
  loading: false,
  error: null,
  maximizedChartId: null,

  dateRange: {
    preset: "all",
    startDate: "2026-11-01",
    endDate: "2026-11-23",
  },

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
      .map((m) => ({
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: (m.name || "").trim(),
        email: (m.email || "").trim(),
        role: "Member",
      }))
      .filter((m) => m.name && m.email);

    if (cleaned.length < 1) {
      return { ok: false, message: "Add at least one family member to upgrade to Family Plan." };
    }

    set({
      accountPlan: "family",
      dashboardView: "family",
      familyMembers: [{ ...owner, role: "Owner" }, ...cleaned].slice(0, MAX_FAMILY_MEMBERS),
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
        { id: `u-${Date.now()}`, name: name.trim(), email: email.trim(), role: "Member" },
      ],
    });
    return { ok: true };
  },

  removeFamilyMember: (memberId) => {
    const { familyMembers, currentUser } = get();
    if (memberId === currentUser.id && familyMembers.length > 1) {
      return { ok: false, message: "Owner cannot be removed while other members remain." };
    }
    const remaining = familyMembers.filter((m) => m.id !== memberId);
    if (remaining.length <= 1) {
      set({
        familyMembers: remaining.length === 1 ? remaining : [{ ...currentUser, role: "Owner" }],
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

    const payload = {
      ...entry,
      id: `t-${Date.now()}`,
      time: entry.time || "16:25",
      memberId: author.id,
      member: author.name,
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
      id: `w-${Date.now()}`,
      name: name.trim(),
      type,
      balance: Number(balance) || 0,
      lowThreshold: Number(lowThreshold) || 1000,
    };
    const saved = await createWallet(payload);
    set((state) => ({ wallets: [...state.wallets, saved] }));
  },
}));