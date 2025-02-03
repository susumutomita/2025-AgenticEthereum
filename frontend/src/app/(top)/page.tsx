import { WalletConnectButton } from "../components/wallet-connect-button";
import { FeatureCard } from "../components/feature-card";
import { Brain, TrendingUp, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">
          Welcome to CryptoDaily Brief
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-up">
          Get personalized daily cryptocurrency briefings, powered by AI and
          on-chain data.
        </p>
        <WalletConnectButton />
        <div className="mt-12 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose CryptoDaily Brief?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="AI-Powered Insights"
            description="Leverage cutting-edge AI to get personalized investment recommendations."
            icon={Brain}
          />
          <FeatureCard
            title="Real-Time Analytics"
            description="Stay ahead with real-time on-chain data and market trends."
            icon={TrendingUp}
          />
          <FeatureCard
            title="Secure & Private"
            description="Your data is encrypted and your privacy is our top priority."
            icon={Shield}
          />
        </div>
      </section>
    </div>
  );
}
