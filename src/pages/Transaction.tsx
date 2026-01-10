import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Send, Wallet, ArrowRight, Settings, Check, Clock, Zap, AlertTriangle, Eye, EyeOff, RefreshCw } from "lucide-react";
import QuantumGrid from "@/components/QuantumGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Transaction = () => {
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [priority, setPriority] = useState("normal");
    const [amount, setAmount] = useState("");

    const priorities = [
        {
            id: "economic",
            label: "Économique",
            time: "~30 min",
            fee: "0.0001",
            icon: Wallet,
            color: "text-blue-400"
        },
        {
            id: "normal",
            label: "Normal",
            time: "~10 min",
            fee: "0.0005",
            icon: Clock,
            color: "text-amber-400"
        },
        {
            id: "fast",
            label: "Rapide",
            time: "~2 min",
            fee: "0.001",
            icon: Zap,
            color: "text-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden text-foreground bg-black selection:bg-primary/20">
            <QuantumGrid />

            <div className="relative z-10 container mx-auto px-4 pt-28 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto space-y-8"
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
                            Signez et diffusez vos transactions blockchain en toute sécurité avec Dilithium Level 2.
                        </p>
                    </div>

                    <Tabs defaultValue="sign" className="w-full max-w-lg mx-auto mb-12">
                        <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-white/10 p-1">
                            <TabsTrigger value="sign" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                                <Shield className="w-4 h-4 mr-2" />
                                Signer
                            </TabsTrigger>
                            <TabsTrigger value="broadcast" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary" disabled>
                                <Send className="w-4 h-4 mr-2" />
                                Diffuser
                            </TabsTrigger>
                            <TabsTrigger value="network" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary" disabled>
                                <Settings className="w-4 h-4 mr-2" />
                                Réseau
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Alice / Sender Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group relative p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Wallet className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Alice</h3>
                                    <p className="text-xs text-emerald-500/80 font-mono tracking-wider">EXPÉDITEUR</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-500/90 leading-relaxed">
                                        Ne partagez jamais votre clé privée. Elle donne un contrôle total sur vos fonds.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Clé Privée (Sender)</Label>
                                        <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                                            <RefreshCw className="w-3 h-3" /> Générer
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type={showPrivateKey ? "text" : "password"}
                                            placeholder="Entrez votre clé privée (64 caractères hex)"
                                            className="bg-black/50 border-white/10 focus:border-emerald-500/50 pr-10 font-mono text-sm"
                                        />
                                        <button
                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                        >
                                            {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bob / Receiver Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="group relative p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl"
                        >
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

                            <div className="space-y-4 pt-[76px]"> {/* Spacer to align with Alice's card content start */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Adresse du Destinataire</Label>
                                    <Input
                                        placeholder="0x..."
                                        className="bg-black/50 border-white/10 focus:border-purple-500/50 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Flow Visualizer */}
                    <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-4 text-muted-foreground/30">
                            <div className="p-4 rounded-xl border border-dashed border-current">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-current" />
                                <div className="w-2 h-2 rounded-full bg-current" />
                                <div className="w-2 h-2 rounded-full bg-current" />
                                <ArrowRight className="w-4 h-4" />
                            </div>
                            <div className="p-4 rounded-xl border border-dashed border-current">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Amount & Priority Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Amount */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl"
                        >
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
                        </motion.div>

                        {/* Priority */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 rounded-2xl glass-card border border-white/10 bg-black/40 backdrop-blur-xl"
                        >
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">Priorité de transaction</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {priorities.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPriority(p.id)}
                                        className={cn(
                                            "relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2",
                                            priority === p.id
                                                ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                                                : "bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                                        )}
                                    >
                                        <p.icon className={cn("w-5 h-5", p.color)} />
                                        <span className="text-xs font-medium text-white">{p.label}</span>
                                        <div className="text-[10px] text-muted-foreground text-center">
                                            <div>{p.time}</div>
                                            <div className="font-mono text-primary/70">{p.fee} QTX</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col items-center gap-4 pt-8"
                    >
                        <Button
                            size="lg"
                            className="w-full max-w-md h-14 text-lg font-bold bg-gradient-to-r from-primary to-emerald-400 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] transition-all duration-500"
                        >
                            <Shield className="w-5 h-5 mr-2" />
                            Signer la Transaction
                        </Button>

                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Toutes les opérations sont effectuées côté client. Vos clés privées ne quittent jamais votre navigateur.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default Transaction;
