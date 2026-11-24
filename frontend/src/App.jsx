import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import DashboardPage from "./components/pages/DashboardPage";
import TransactionsHistoryPage from "./components/pages/TransactionHistoryPage";
import FamilyMembersPage from "./components/pages/FamilyMembersPage";
import ProfileSettingsPage from "./components/pages/ProfileSettingsPage";
import WalletsPage from "./components/pages/WalletsPage";
import EmailVerificationPage from "./components/pages/EmailVerificationPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />}/>
        <Route path="/transactions" element={<TransactionsHistoryPage />} />
        <Route path="/family" element={<FamilyMembersPage />} />
        <Route path="/settings" element={<ProfileSettingsPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/verify" element={<EmailVerificationPage/>}/> 
        <Route path="/forgetPass" element={<ForgotPasswordPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;