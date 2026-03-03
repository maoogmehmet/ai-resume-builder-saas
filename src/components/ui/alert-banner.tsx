"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const alertBannerVariants = cva(
    "group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-xl",
    {
        variants: {
            variant: {
                default: "border-white/10 bg-zinc-950/80 text-white",
                success: "border-emerald-500/20 bg-emerald-500/[0.02] text-white",
                destructive: "border-red-500/20 bg-red-500/[0.02] text-white",
                warning: "border-amber-500/20 bg-amber-500/[0.02] text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const iconVariants = cva("mt-0.5 h-6 w-6 flex-shrink-0", {
    variants: {
        variant: {
            default: "text-white",
            success: "text-emerald-500",
            destructive: "text-red-500",
            warning: "text-amber-500",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertBannerVariants> {
    title: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    onDismiss: () => void;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

const AlertBanner = React.forwardRef<HTMLDivElement, AlertBannerProps>(
    ({ className, variant, title, description, icon, onDismiss, primaryAction, secondaryAction, ...props }, ref) => {

        const DefaultIcon = {
            success: <CheckCircle2 />,
            destructive: <XCircle />,
            warning: <AlertCircle />,
            default: <CheckCircle2 />,
        }[variant || "default"];

        return (
            <AnimatePresence>
                <motion.div
                    ref={ref}
                    role="alert"
                    aria-live="assertive"
                    className={cn(alertBannerVariants({ variant }), className)}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    {...props as any}
                >
                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss notification"
                        className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition-all hover:bg-white/5 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className={cn(iconVariants({ variant }))}>
                        {icon || DefaultIcon}
                    </div>

                    <div className="flex flex-1 flex-col pr-8">
                        <h3 className="font-black tracking-tight text-white uppercase italic text-sm">{title}</h3>
                        {description && <div className="mt-1 text-xs text-zinc-500 font-bold uppercase tracking-tight">{description}</div>}

                        {(primaryAction || secondaryAction) && (
                            <div className="mt-6 flex items-center gap-4">
                                {secondaryAction && (
                                    <button
                                        onClick={secondaryAction.onClick}
                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
                                    >
                                        {secondaryAction.label}
                                    </button>
                                )}
                                {primaryAction && (
                                    <button
                                        onClick={primaryAction.onClick}
                                        className="text-[10px] font-black uppercase tracking-widest text-emerald-500 transition-colors hover:text-emerald-400"
                                    >
                                        {primaryAction.label}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }
);
AlertBanner.displayName = "AlertBanner";

export { AlertBanner };
