import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { ArrowLeft, Key, FileSignature } from "lucide-react";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
                <a
                    href="https://quantumresistantcoin.com"
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Main Site</span>
                </a>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <Link
                    to="/"
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        isActive("/")
                            ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <Key className="w-4 h-4" />
                    <span className="hidden sm:inline">Key Generator</span>
                </Link>

                <Link
                    to="/transaction"
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        isActive("/transaction")
                            ? "bg-primary/20 text-primary border border-primary/20 shadow-[0_0_10px_rgba(45,212,191,0.2)]"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <FileSignature className="w-4 h-4" />
                    <span className="hidden sm:inline">Create/Sign Transaction</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
