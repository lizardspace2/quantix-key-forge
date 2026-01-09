import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "icon" | "full";
}

const Logo = ({ className, variant = "full" }: LogoProps) => {
    return (
        <div className={cn("inline-flex items-center gap-2", className)}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-primary"
            >
                <path
                    d="M20 5L32.9904 12.5V27.5L20 35L7.00962 27.5V12.5L20 5Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="quantum-border"
                />
                <path
                    d="M20 12L26.9282 16V24L20 28L13.0718 24V16L20 12Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
                <circle cx="20" cy="20" r="3" fill="currentColor" />
                <path
                    d="M20 35V28"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
            {variant === "full" && (
                <span className="font-bold text-2xl tracking-tight">
                    <span className="text-primary">Quantix</span>
                    <span className="text-foreground">KeyForge</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
