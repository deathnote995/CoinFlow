import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useDashboardStore } from "../../store/useDashboardStore.js";
import { useThemeStore } from "../../store/useThemeStore.js";

const NAV_ITEMS = [
    { label: "Dashboard", to: "/dashboard", familyOnly: false },
    { label: "Transactions", to: "/transactions", familyOnly: false },
    { label: "Family Members", to: "/family", familyOnly: true },
    { label: "Profile & Plan", to: "/settings", familyOnly: false },
];

const AppSidebarShell = ({ pageTitle, pageSubtitle, children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const accountPlan = useDashboardStore((s) => s.accountPlan);
    const dashboardView = useDashboardStore((s) => s.dashboardView);
    const setDashboardView = useDashboardStore((s) => s.setDashboardView);
    const currentUser = useDashboardStore((s) => s.currentUser);
    const familyMembers = useDashboardStore((s) => s.familyMembers);

    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);

    const isFamily = accountPlan === "family";

    return (
        <div
            style={{
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
            }}
            className="flex min-h-screen w-full flex-col"
        >
            <div className="flex w-full flex-1">
                {/* Sidebar */}
                <aside
                    style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-color)",
                    }}
                    className={`${sidebarOpen ? "fixed inset-y-0 left-0 z-40 flex" : "hidden"
                        } w-64 shrink-0 flex-col justify-between border-r p-4 lg:sticky lg:top-0 lg:flex lg:h-screen`}
                >
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <Link
                                to="/"
                                style={{ color: "var(--accent)" }}
                                className="text-xl font-bold tracking-tight"
                            >
                                CoinFlow
                            </Link>
                            <span className="cf-badge-accent uppercase">{accountPlan}</span>
                        </div>

                        <nav className="space-y-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = location.pathname === item.to;
                                const disabledForSolo = item.familyOnly && !isFamily;

                                if (disabledForSolo) {
                                    return (
                                        <div
                                            key={item.to}
                                            title="Upgrade to Family Plan to manage family members"
                                            style={{ color: "var(--text-muted)" }}
                                            className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2.5 text-sm opacity-50"
                                        >
                                            <span>{item.label}</span>
                                            <span className="text-[11px]">Locked</span>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setSidebarOpen(false)}
                                        style={{
                                            backgroundColor: isActive ? "var(--accent)" : "transparent",
                                            color: isActive ? "var(--accent-text)" : "var(--text-main)",
                                        }}
                                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition hover:opacity-90"
                                    >
                                        <span>{item.label}</span>
                                        {item.to === "/family" && isFamily && (
                                            <span className="text-xs opacity-80">{familyMembers.length}/5</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Dual Dashboard Switcher (Only available on Family Plan) */}
                        {isFamily && (
                            <div
                                style={{
                                    backgroundColor: "var(--bg-subtle)",
                                    borderColor: "var(--border-color)",
                                }}
                                className="rounded-xl border p-3"
                            >
                                <p
                                    style={{ color: "var(--text-muted)" }}
                                    className="text-[11px] font-semibold uppercase"
                                >
                                    Dashboard Mode
                                </p>
                                <div className="mt-2 grid grid-cols-2 gap-1.5">
                                    {[
                                        { id: "personal", label: "My Spend" },
                                        { id: "family", label: "Family" },
                                    ].map((tab) => {
                                        const active = dashboardView === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setDashboardView(tab.id)}
                                                style={{
                                                    backgroundColor: active ? "var(--accent)" : "var(--bg-surface)",
                                                    color: active ? "var(--accent-text)" : "var(--text-main)",
                                                    borderColor: "var(--border-color)",
                                                }}
                                                className="cursor-pointer rounded-lg border py-1.5 text-xs font-semibold"
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{ borderColor: "var(--border-color)" }}
                        className="space-y-3 border-t pt-4"
                    >
                        <div className="px-2">
                            <p className="text-sm font-semibold">{currentUser.name}</p>
                            <p style={{ color: "var(--text-muted)" }} className="truncate text-xs">
                                {currentUser.email}
                            </p>
                        </div>
                        <Link
                            to="/login"
                            style={{ borderColor: "var(--border-color)" }}
                            className="block rounded-lg border px-3 py-2 text-center text-xs font-semibold hover:opacity-80"
                        >
                            Logout
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <header
                        style={{
                            backgroundColor: "var(--bg-surface)",
                            borderColor: "var(--border-color)",
                        }}
                        className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b px-4 py-3.5 sm:px-6"
                    >
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen((prev) => !prev)}
                                style={{
                                    backgroundColor: "var(--bg-subtle)",
                                    borderColor: "var(--border-color)",
                                }}
                                className="cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-semibold lg:hidden"
                            >
                                Menu
                            </button>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight sm:text-xl">{pageTitle}</h1>
                                {pageSubtitle && (
                                    <p style={{ color: "var(--text-muted)" }} className="hidden text-xs sm:block">
                                        {pageSubtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {isFamily && (
                                <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex" style={{ borderColor: "var(--border-color)" }}>
                                    <button
                                        type="button"
                                        onClick={() => setDashboardView("personal")}
                                        style={{
                                            backgroundColor: dashboardView === "personal" ? "var(--accent)" : "transparent",
                                            color: dashboardView === "personal" ? "var(--accent-text)" : "var(--text-main)",
                                        }}
                                        className="cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold"
                                    >
                                        Personal View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDashboardView("family")}
                                        style={{
                                            backgroundColor: dashboardView === "family" ? "var(--accent)" : "transparent",
                                            color: dashboardView === "family" ? "var(--accent-text)" : "var(--text-main)",
                                        }}
                                        className="cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold"
                                    >
                                        Family View
                                    </button>
                                </div>
                            )}

                            {/* <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border-color)",
                  color: "var(--accent)",
                }}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button> */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                style={{
                                    backgroundColor: "var(--bg-subtle)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--accent)",
                                }}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition hover:opacity-85"
                            >
                                {theme === "dark" ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="12" r="4" />
                                        <path d="M12 2v2" />
                                        <path d="M12 20v2" />
                                        <path d="m4.93 4.93 1.41 1.41" />
                                        <path d="m17.66 17.66 1.41 1.41" />
                                        <path d="M2 12h2" />
                                        <path d="M20 12h2" />
                                        <path d="m6.34 17.66-1.41 1.41" />
                                        <path d="m19.07 4.93-1.41 1.41" />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </header>

                    <main className="w-full flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AppSidebarShell; 