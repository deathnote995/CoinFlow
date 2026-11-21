import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import HeroSection from "../landing/HeroSection";
import FeaturesSection from "../landing/FeaturesSection";
import AnalyticsPreviewSection from "../landing/AnalyticsPreviewSection";
import CompanionAppSection from "../landing/CompanionAppSection";
import SecuritySection from "../landing/SecuritySection";
import ServicesAndCompanySection from "../landing/ServicesAndCompanySection";

const LandingPage = () => {
  return (
    <div
      id="top"
      style={{
        backgroundColor: "var(--bg-app)",
        color: "var(--text-main)",
      }}
      className="flex min-h-screen flex-col"
    >
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AnalyticsPreviewSection />
        <CompanionAppSection />
        <SecuritySection />
        <ServicesAndCompanySection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;