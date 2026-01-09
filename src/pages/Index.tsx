import { motion } from "framer-motion";
import QuantumGrid from "@/components/QuantumGrid";
import WalletGenerator from "@/components/WalletGenerator";
import Logo from "@/components/Logo";
import { Shield, Cpu, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <QuantumGrid />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="pt-16 pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <Logo className="w-auto h-20 [&>svg]:w-20 [&>svg]:h-20 [&>span]:hidden" />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="quantum-text">Quantix</span>
              <span className="text-foreground"> Key Forge</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generate quantum-secure wallets for the NaivecoinStake blockchain.
              Powered by Dilithium post-quantum cryptography.
            </p>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <FeatureBadge icon={<Cpu className="w-4 h-4" />} text="Dilithium Level 2" />
              <FeatureBadge icon={<Lock className="w-4 h-4" />} text="Post-Quantum Secure" />
              <FeatureBadge icon={<Shield className="w-4 h-4" />} text="Client-Side Generation" />
            </motion.div>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          <WalletGenerator />
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Quantix (QTX) • Built for NaivecoinStake Blockchain
          </p>
        </footer>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 quantum-border text-sm text-muted-foreground">
    <span className="text-primary">{icon}</span>
    {text}
  </div>
);

export default Index;
