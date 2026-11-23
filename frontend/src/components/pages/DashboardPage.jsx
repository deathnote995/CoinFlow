import { useEffect } from "react";
import AppSidebarShell from "../layout/AppSidebarShell";
import GlobalDateBar from "../dashboard/GlobalDateBar";
import AnalyticsChartsGrid from "../dashboard/AnalyticsChartsGrid";
import TransactionHistoryTable from "../dashboard/TransactionHistoryTable";
import { useDashboardStore } from "../../store/useDashboardStore.js";

const DashboardPage = () => {
  const fetchDashboardData = useDashboardStore((s) => s.fetchDashboardData);
  const planType = useDashboardStore((s) => s.planType);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <AppSidebarShell
      pageTitle="Analytics Dashboard"
      pageSubtitle={
        planType === "family"
          ? "Family account view — cumulative household spend, member bifurcation & latest activity"
          : "Individual account view — personal wallets, spending trends & latest activity"
      }
    >
      <GlobalDateBar />
      <AnalyticsChartsGrid />
      <TransactionHistoryTable />
    </AppSidebarShell>
  );
};

export default DashboardPage;