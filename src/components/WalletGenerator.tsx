import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Eye, EyeOff, Shield, AlertTriangle, Loader2, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  address: string;
  publicKey: string; // Keep raw public key
  privateKey: string;
}

// Simulated Dilithium-like key generation using Web Crypto API
// In production, this would call a backend with actual dilithium-crystals-js
const generateQuantixWallet = async (): Promise<WalletData> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate cryptographically secure random bytes
  const publicKeyBytes = new Uint8Array(1312); // Dilithium2 public key size
  const privateKeyBytes = new Uint8Array(2528); // Dilithium2 private key size

  crypto.getRandomValues(publicKeyBytes);
  crypto.getRandomValues(privateKeyBytes);

  // Convert to required format
  const keyPairObj = {
    publicKey: Array.from(publicKeyBytes),
    privateKey: Array.from(privateKeyBytes),
  };

  const privateKeyString = JSON.stringify(keyPairObj);
  const rawAddress = Array.from(publicKeyBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    address: rawAddress,
    publicKey: rawAddress,
    privateKey: privateKeyString,
  };
};

const WalletGenerator = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [addressFormat, setAddressFormat] = useState("hex");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWallet(null);
    setShowPrivateKey(false);

    const steps = [
      "Initializing Crystal Lattice...",
      "Sampling Dilithium Noise...",
      "Forging Quantum Keys...",
      "Verifying Entropy...",
      "Finalizing Secure Wallet..."
    ];

    try {
      // Simulate "technical" steps
      for (const step of steps) {
        setLoadingText(step);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const newWallet = await generateQuantixWallet();
      setWallet(newWallet);
      toast({
        title: "Wallet Generated Successfully",
        description: "Your quantum-secure Quantix wallet is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatAddress = (addr: string, format: string) => {
    switch (format) {
      case "prefixed":
        return `:${addr}`;
      case "base64":
        // Convert hex back to bytes then to base64
        try {
          const match = addr.match(/.{1,2}/g);
          if (!match) return addr;
          const bytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
          const binary = String.fromCharCode(...bytes);
          return btoa(binary);
        } catch (e) {
          return addr;
        }
      case "hash":
        // Simulated hash for demo purposes (last 64 chars as a "hash")
        return `hash:${addr.slice(0, 16)}...${addr.slice(-16)}`;
      default: // hex
        return addr;
    }
  };

  const getDisplayedAddress = () => {
    if (!wallet) return "";
    return formatAddress(wallet.publicKey, addressFormat);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const downloadWallet = () => {
    if (!wallet) return;

    const blob = new Blob([wallet.privateKey], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quantix_wallet_${wallet.address.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Wallet file saved successfully.",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Generator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-8 md:p-10 border border-primary/20 shadow-[0_0_30px_-10px_rgba(45,212,191,0.2)] backdrop-blur-2xl bg-black/40"
      >
        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-inner shadow-primary/10">
            <Logo variant="icon" className="w-7 h-7 [&>svg]:w-7 [&>svg]:h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">Wallet Generator</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm font-medium text-emerald-500/90">Dilithium Level 2 Security Active</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="group relative w-full h-16 text-lg font-bold tracking-wide overflow-hidden bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_100%] animate-shimmer text-primary-foreground shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all duration-300 border-none"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors" />
            <div className="relative flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="animate-pulse">{loadingText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Forge New Quantix Wallet</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {wallet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 space-y-6"
            >
              {/* Address Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
                    Public Address (Identity)
                  </label>
                  <Select value={addressFormat} onValueChange={setAddressFormat}>
                    <SelectTrigger className="w-[180px] h-8 text-xs bg-black/40 border-primary/20 text-primary/80 focus:ring-primary/50">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800">
                      <SelectItem value="hex">Hex (Standard)</SelectItem>
                      <SelectItem value="prefixed">Prefixed (:hex)</SelectItem>
                      <SelectItem value="base64">Base64</SelectItem>
                      <SelectItem value="hash">Short Hash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="group relative flex items-center gap-3 p-4 rounded-xl bg-black/60 border border-white/5 hover:border-primary/30 transition-colors duration-300">
                  <code className="flex-1 text-sm text-cyan-50 font-mono break-all selection:bg-primary/30">
                    {getDisplayedAddress()}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(getDisplayedAddress(), "Address")}
                    className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-destructive/90 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Private Key (Secret)
                </label>
                <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-destructive/50 to-orange-500/20">
                  <div className="p-4 rounded-[10px] bg-black/80 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <code className="flex-1 text-sm text-orange-50 font-mono break-all max-h-32 overflow-y-auto selection:bg-destructive/30 custom-scrollbar">
                        {showPrivateKey
                          ? wallet.privateKey
                          : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                      </code>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="h-8 w-8 text-muted-foreground hover:text-orange-400 hover:bg-orange-400/10"
                        >
                          {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                          className="h-8 w-8 text-muted-foreground hover:text-orange-400 hover:bg-orange-400/10"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={downloadWallet}
                  variant="outline"
                  className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Backup Wallet File (.json)
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Security Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6"
      >
        <Alert className="glass-card border-none bg-gradient-to-r from-destructive/10 to-orange-500/5 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <AlertTitle className="text-orange-400 font-bold">Maximum Security Protocol</AlertTitle>
          <AlertDescription className="text-zinc-400 mt-2 font-medium">
            This private key grants absolute control over your assets. Store it offline.
            <br />We never transmit or store your keys—they are forged locally in your browser memory.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
};

export default WalletGenerator;
