import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Send, Wallet, ArrowRight, Settings, Check, Clock, Zap, AlertTriangle, Eye, EyeOff, RefreshCw, Server, Box, Globe, FileJson, Loader2, Copy } from "lucide-react";
import QuantumGrid from "@/components/QuantumGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { generateKeyPair, deriveAddress, createSignature, calculateTxId, SignedTransaction } from "@/lib/quantix-crypto";
import { useToast } from "@/hooks/use-toast";

type TxStatus = "idle" | "signing" | "signed" | "broadcasting" | "mempool" | "mining" | "confirmed";

const Transaction = () => {
    const { toast } = useToast();

    // Alice State
    const [alicePrivateKey, setAlicePrivateKey] = useState("");
    const [alicePublicKey, setAlicePublicKey] = useState("");
    const [aliceAddress, setAliceAddress] = useState("");
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

    // Transaction State
    const [bobAddress, setBobAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [priority, setPriority] = useState("normal");
    const [fee, setFee] = useState("0.0005");
    const [status, setStatus] = useState<TxStatus>("idle");
    const [signedTx, setSignedTx] = useState<SignedTransaction | null>(null);

    // Broadcast Simulation State
    const [broadcastLog, setBroadcastLog] = useState<string[]>([]);
    const [confirmations, setConfirmations] = useState(0);
    const [activeTab, setActiveTab] = useState("sign");

    // Load demo "Bob" address
    useEffect(() => {
        setBobAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    }, []);

    const handleGenerateKeys = async () => {
        setIsGeneratingKeys(true);
        try {
            const keys = await generateKeyPair();
            setAlicePrivateKey(keys.privateKey);
            setAlicePublicKey(keys.publicKey);
            setAliceAddress(deriveAddress(keys.publicKey));
            toast({
                title: "Keys Generated",
                description: "New Dilithium keypair generated for Alice.",
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingKeys(false);
        }
    };

    const updateFee = (newPriority: string) => {
        setPriority(newPriority);
        switch (newPriority) {
            case "economic": setFee("0.0001"); break;
            case "normal": setFee("0.0005"); break;
            case "fast": setFee("0.001"); break;
        }
    };

    const handleSign = async () => {
        if (!alicePrivateKey || !bobAddress || !amount) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields (Alice's Key, Bob's Address, Amount).",
                variant: "destructive"
            });
            return;
        }

        setStatus("signing");
        try {
            const timestamp = Date.now();
            const txData = {
                from: aliceAddress,
                to: bobAddress,
                amount,
                fee,
                timestamp,
                publicKey: alicePublicKey
            };

            // Create signature based on the data
            const message = JSON.stringify(txData);
            const signature = await createSignature(message, alicePrivateKey);
            const txId = await calculateTxId({ ...txData, publicKey: alicePublicKey }); // Include pk in ID calculation for demo

            const completeTx: SignedTransaction = {
                txId,
                ...txData,
                signature
            };

            setSignedTx(completeTx);
            setStatus("signed");
            toast({
                title: "Transaction Signed",
                description: "Cryptographic signature generated successfully.",
            });
        } catch (e) {
            toast({ title: "Error", description: "Failed to sign transaction.", variant: "destructive" });
            setStatus("idle");
        }
    };

    const addLog = (msg: string) => setBroadcastLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleBroadcast = async () => {
        if (!signedTx) return;
        setActiveTab("broadcast");
        setStatus("broadcasting");
        setBroadcastLog([]);
        setConfirmations(0);

        // Simulation Sequence
        addLog("Initializing P2P connection...");
        await new Promise(r => setTimeout(r, 1000));

        addLog(`Connected to node 104.23.11.89 (Latency: 42ms)`);
        addLog(`Broadcasting TxID: ${signedTx.txId.slice(0, 16)}...`);
        await new Promise(r => setTimeout(r, 1500));

        setStatus("mempool");
        addLog("Transaction accepted by mempool");
        addLog("Propagating to peers (7/12)...");
        await new Promise(r => setTimeout(r, 2000));

        setStatus("mining");
        addLog("Miner found! Validating PoW...");
        addLog("Building Block #8,942,123...");
        await new Promise(r => setTimeout(r, 3000));

        setStatus("confirmed");
        addLog("Block Mined Successfully! Tx Included.");

        // Simulate confirmations
        let confs = 1;
        setConfirmations(confs);
        const interval = setInterval(() => {
            confs++;
            setConfirmations(confs);
            addLog(`New block mined on top. Confirmations: ${confs}`);
            if (confs >= 6) {
                clearInterval(interval);
                addLog("Transaction Finalized (6 confirmations).");
            }
        }, 2000);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: `${label} copied to clipboard.` });
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-foreground bg-black selection:bg-primary/20">
            <QuantumGrid />

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-2">
                            <Shield className="w-3 h-3" />
                            <span>Signature & Diffusion Blockchain</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
                                Quantix Signer
                            </span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Signez et diffusez vos transactions avec sécurité Post-Quantum Dilithium.
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList className="bg-black/40 border border-white/10 p-1">
                                <TabsTrigger value="sign" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-8">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Signer
                                </TabsTrigger>
                                <TabsTrigger value="broadcast" disabled={!signedTx} className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-8">
                                    <Send className="w-4 h-4 mr-2" />
                                    Diffuser
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="sign" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Alice Card */}
                                <div className="group relative p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <Wallet className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">Alice</h3>
                                                <p className="text-xs text-emerald-500/80 font-mono tracking-wider">EXPÉDITEUR</p>
                                            </div>
                                        </div>
                                        {aliceAddress && (
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground">Solde Estimé</div>
                                                <div className="font-mono text-emerald-400">1,240.50 QTX</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {!alicePrivateKey && (
                                            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                                                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-yellow-500/90">
                                                    Commencez par générer ou importer une clé privée pour Alice.
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Clé Privée (Sender)</Label>
                                                <button
                                                    onClick={handleGenerateKeys}
                                                    disabled={isGeneratingKeys}
                                                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors disabled:opacity-50"
                                                >
                                                    {isGeneratingKeys ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                                    Générer Aléatoirement
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    type={showPrivateKey ? "text" : "password"}
                                                    value={alicePrivateKey}
                                                    onChange={(e) => {
                                                        setAlicePrivateKey(e.target.value);
                                                        // Normally would try to derive public key from private, but here we simplify
                                                        if (e.target.value === "") setAliceAddress("");
                                                    }}
                                                    placeholder="Entrez clé privée ou cliquez sur générer"
                                                    className="bg-black/50 border-white/10 focus:border-emerald-500/50 pr-10 font-mono text-xs"
                                                />
                                                <button
                                                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                                >
                                                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {aliceAddress && (
                                            <div className="pt-2 animate-in fade-in">
                                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Adresse Publique Dérivée</Label>
                                                <div className="mt-1 p-2 rounded bg-black/60 border border-white/5 font-mono text-xs text-muted-foreground break-all">
                                                    {aliceAddress}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bob Card */}
                                <div className="group relative p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <Wallet className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Bob</h3>
                                            <p className="text-xs text-purple-500/80 font-mono tracking-wider">DESTINATAIRE</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-12">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Adresse du Destinataire</Label>
                                            <Input
                                                value={bobAddress}
                                                onChange={(e) => setBobAddress(e.target.value)}
                                                placeholder="0x..."
                                                className="bg-black/50 border-white/10 focus:border-purple-500/50 font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amount & Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                                        <Send className="w-4 h-4" /> Montant à envoyer
                                    </h3>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="bg-black/50 border-white/10 text-2xl h-16 pl-4 pr-16 font-mono tracking-wide focus:ring-primary/20 focus:border-primary/50"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                                            QTX
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Priorité de transaction</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: "economic", label: "Eco", icon: Wallet, color: "text-blue-400" },
                                            { id: "normal", label: "Normal", icon: Clock, color: "text-amber-400" },
                                            { id: "fast", label: "Rapide", icon: Zap, color: "text-emerald-400" }
                                        ].map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => updateFee(p.id)}
                                                className={cn(
                                                    "relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2",
                                                    priority === p.id
                                                        ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                                        : "bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                                                )}
                                            >
                                                <p.icon className={cn("w-5 h-5", p.color)} />
                                                <span className="text-xs font-medium text-white">{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-center text-xs text-muted-foreground">Frais estimés: <span className="font-mono text-primary">{fee} QTX</span></div>
                                </div>
                            </div>

                            {/* Sign Action */}
                            {!signedTx ? (
                                <div className="flex flex-col items-center gap-4 pt-4">
                                    <Button
                                        onClick={handleSign}
                                        disabled={status === "signing" || !alicePrivateKey}
                                        size="lg"
                                        className="w-full max-w-md h-14 text-lg font-bold bg-gradient-to-r from-primary to-emerald-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] transition-all duration-500"
                                    >
                                        {status === "signing" ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                                        {status === "signing" ? "Calcul en cours..." : "Signer la Transaction"}
                                    </Button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="rounded-xl border border-primary/30 bg-primary/5 p-6 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                            <Check className="w-5 h-5" /> Transaction Signée
                                        </h3>
                                        <Button size="sm" onClick={handleBroadcast} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                                            Diffuser Maintenant <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="bg-black/80 rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-auto max-h-60 border border-white/5 relative group">
                                        <Button
                                            variant="ghost" size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20"
                                            onClick={() => copyToClipboard(JSON.stringify(signedTx, null, 2), "Signed TX")}
                                        >
                                            <Copy className="w-4 h-4 text-white" />
                                        </Button>
                                        <pre>{JSON.stringify(signedTx, null, 2)}</pre>
                                    </div>
                                </motion.div>
                            )}
                        </TabsContent>

                        <TabsContent value="broadcast" className="min-h-[500px] animate-in fade-in slide-in-from-right-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Visualizer */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="relative h-64 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-grid-white/[0.02]" />

                                        {/* Connection Lines */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="rgba(45, 212, 191, 0.2)" strokeWidth="2" strokeDasharray="4 4" className={status === "broadcasting" ? "animate-pulse" : ""} />
                                            <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="rgba(45, 212, 191, 0.2)" strokeWidth="2" strokeDasharray="4 4" className={status === "mempool" ? "animate-pulse" : ""} />
                                        </svg>

                                        <div className="flex items-center justify-between w-full px-12 relative z-10">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-full bg-black border-2 border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                                                    <Wallet className="w-6 h-6 text-primary" />
                                                </div>
                                                <span className="text-xs font-mono text-primary">Alice</span>
                                            </div>

                                            <div className={cn("flex flex-col items-center gap-3 transition-opacity duration-500", status === "idle" || status === "signing" ? "opacity-30" : "opacity-100")}>
                                                <div className={cn("w-20 h-20 rounded-xl bg-black border-2 flex items-center justify-center transition-all duration-500", status === "mempool" ? "border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)] scale-110" : "border-white/20")}>
                                                    <Server className={cn("w-8 h-8", status === "mempool" ? "text-amber-400" : "text-muted-foreground")} />
                                                </div>
                                                <span className="text-xs font-mono text-muted-foreground">Mempool</span>
                                            </div>

                                            <div className={cn("flex flex-col items-center gap-3 transition-opacity duration-500", status === "mining" || status === "confirmed" ? "opacity-100" : "opacity-30")}>
                                                <div className={cn("w-24 h-24 rounded-lg bg-black border-2 flex items-center justify-center transition-all duration-500", status === "mining" ? "border-purple-500 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.3)]" : (status === "confirmed" ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-white/20"))}>
                                                    <Box className={cn("w-10 h-10", status === "confirmed" ? "text-emerald-500" : "text-purple-500")} />
                                                </div>
                                                <span className="text-xs font-mono text-muted-foreground">Blockchain</span>
                                            </div>
                                        </div>
                                    </div>

                                    {status === "confirmed" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                                        >
                                            <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/20 mb-4">
                                                <Check className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Transaction Confirmée</h2>
                                            <p className="text-muted-foreground mb-4">Votre transaction a été incluse dans le bloc #8,942,123 et sécurisée par le réseau.</p>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-emerald-500/30">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-sm font-mono text-emerald-400">{confirmations} Confirmations</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Console Log */}
                                <div className="lg:col-span-1">
                                    <div className="h-full rounded-2xl bg-black border border-white/10 p-4 flex flex-col font-mono text-xs">
                                        <div className="flex items-center gap-2 text-muted-foreground border-b border-white/10 pb-2 mb-2">
                                            <Globe className="w-4 h-4" /> Network Log
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar min-h-[300px]">
                                            {broadcastLog.map((log, i) => (
                                                <div key={i} className="text-primary/80 animate-in slide-in-from-left-2">
                                                    <span className="opacity-50 mr-2">{">"}</span>
                                                    {log}
                                                </div>
                                            ))}
                                            {status === "mining" && (
                                                <div className="text-purple-400 animate-pulse">
                                                    <span className="opacity-50 mr-2">{">"}</span>
                                                    Solving PoW puzzle...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                </motion.div>
            </div>
        </div>
    );
};

export default Transaction;
