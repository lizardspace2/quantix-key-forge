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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="quantum-text drop-shadow-[0_0_30px_rgba(45,212,191,0.4)] animate-pulse-glow">Quantix</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40"> Key Forge</span>
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
        <main className="pb-20 relative z-20">
          <WalletGenerator />
        </main>

        {/* Footer */}
        <footer className="py-16 px-4 text-center border-t border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 rounded-full bg-white/5 border border-white/5 mb-2 hover:scale-110 transition-transform duration-500">
              <Logo variant="icon" className="w-8 h-8 text-primary/80" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/80">
                Quantix (QTX)
              </p>
              <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
                Secure. Scalable. Quadratic.
                <br />The next generation of post-quantum digital assets on the NaivecoinStake Blockchain.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-primary/40 font-mono tracking-[0.2em] mt-4 border px-3 py-1 rounded-full border-primary/10 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-md border border-white/5 hover:border-primary/30 transition-all duration-300 text-sm text-muted-foreground hover:text-foreground">
    <span className="text-primary drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">{icon}</span>
    {text}
  </div>
);

export default Index;
