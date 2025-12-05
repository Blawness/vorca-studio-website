"use client";

import { ReactNode } from "react";
import { Zap, Lightbulb, AlertTriangle, Info } from "lucide-react";

type CalloutType = "info" | "tip" | "warning" | "performance";

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const calloutConfig = {
    info: {
        icon: Info,
        borderColor: "border-l-cyan-500",
        bgColor: "bg-cyan-950/40",
        iconColor: "text-cyan-400",
        titleColor: "text-cyan-300",
    },
    tip: {
        icon: Lightbulb,
        borderColor: "border-l-amber-500",
        bgColor: "bg-amber-950/40",
        iconColor: "text-amber-400",
        titleColor: "text-amber-300",
    },
    warning: {
        icon: AlertTriangle,
        borderColor: "border-l-rose-500",
        bgColor: "bg-rose-950/40",
        iconColor: "text-rose-400",
        titleColor: "text-rose-300",
    },
    performance: {
        icon: Zap,
        borderColor: "border-l-emerald-500",
        bgColor: "bg-emerald-950/40",
        iconColor: "text-emerald-400",
        titleColor: "text-emerald-300",
    },
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
    const config = calloutConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={`
                my-6 p-5 rounded-xl border-l-4
                ${config.borderColor} ${config.bgColor}
                backdrop-blur-sm
                transition-all duration-200
                hover:scale-[1.01]
            `}
        >
            <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${config.iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    {title && (
                        <h4 className={`font-semibold mb-2 ${config.titleColor}`}>
                            {title}
                        </h4>
                    )}
                    <div className="text-gray-300 leading-relaxed text-[15px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
