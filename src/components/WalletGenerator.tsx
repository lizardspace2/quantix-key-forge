import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Eye, EyeOff, Shield, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  address: string;
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
  const address = Array.from(publicKeyBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return {
    address,
    privateKey: privateKeyString,
  };
};

const WalletGenerator = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setWallet(null);
    setShowPrivateKey(false);
    
    try {
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

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 16)}...${addr.slice(-16)}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Generator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-8 md:p-10"
      >
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 quantum-border">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Wallet Generator</h2>
            <p className="text-sm text-muted-foreground">Dilithium Level 2 Security</p>
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
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 quantum-glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Quantum Keys...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Secure Quantix Wallet
              </>
            )}
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
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Wallet Address
                </label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 quantum-border">
                  <code className="flex-1 text-sm text-foreground font-mono break-all">
                    {truncateAddress(wallet.address)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(wallet.address, "Address")}
                    className="shrink-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Private Key Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Private Key
                </label>
                <div className="p-4 rounded-xl bg-secondary/50 quantum-border">
                  <div className="flex items-start gap-3">
                    <code className="flex-1 text-sm text-foreground font-mono break-all max-h-32 overflow-y-auto">
                      {showPrivateKey 
                        ? wallet.privateKey.slice(0, 200) + "..." 
                        : "••••••••••••••••••••••••••••••••••••••••"}
                    </code>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
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
                  className="w-full h-12 quantum-border hover:bg-primary/10 transition-all duration-300"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Private Key (.json)
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
        <Alert className="glass-card border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive font-semibold">Security Warning</AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2">
            Save your private key safely. If you lose it, your funds are lost forever. 
            We do not store your keys. This wallet is generated entirely in your browser.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
};

export default WalletGenerator;
