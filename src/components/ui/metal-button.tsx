"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ColorVariant =
    | "default"
    | "primary"
    | "success"
    | "error"
    | "gold"
    | "bronze";

interface MetalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ColorVariant;
}

const colorVariants: Record<
    ColorVariant,
    {
        outer: string;
        inner: string;
        button: string;
        textColor: string;
        textShadow: string;
    }
> = {
    default: {
        outer: "bg-gradient-to-b from-[#333] to-[#111]",
        inner: "bg-gradient-to-b from-[#444] via-[#222] to-[#111]",
        button: "bg-gradient-to-b from-zinc-800 to-zinc-900",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(0_0_0_/_100%)]",
    },
    primary: {
        outer: "bg-gradient-to-b from-blue-400/20 to-blue-900/40",
        inner: "bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900",
        button: "bg-gradient-to-b from-blue-600 to-blue-800",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(30_58_138_/_100%)]",
    },
    success: {
        outer: "bg-gradient-to-b from-emerald-400/20 to-emerald-900/40",
        inner: "bg-gradient-to-b from-emerald-500 via-emerald-700 to-emerald-900",
        button: "bg-gradient-to-b from-emerald-600 to-emerald-800",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
    },
    error: {
        outer: "bg-gradient-to-b from-red-400/20 to-red-900/40",
        inner: "bg-gradient-to-b from-red-500 via-red-700 to-red-900",
        button: "bg-gradient-to-b from-red-600 to-red-800",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(127_29_29_/_100%)]",
    },
    gold: {
        outer: "bg-gradient-to-b from-amber-400/20 to-amber-900/40",
        inner: "bg-gradient-to-b from-amber-500 via-amber-700 to-amber-900",
        button: "bg-gradient-to-b from-amber-600 to-amber-800",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(120_53_15_/_100%)]",
    },
    bronze: {
        outer: "bg-gradient-to-b from-orange-400/20 to-orange-900/40",
        inner: "bg-gradient-to-b from-orange-500 via-orange-700 to-orange-900",
        button: "bg-gradient-to-b from-orange-600 to-orange-800",
        textColor: "text-white",
        textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
    },
};

const metalButtonVariants = (
    variant: ColorVariant = "default",
    isPressed: boolean,
    isHovered: boolean,
    isTouchDevice: boolean,
) => {
    const colors = colorVariants[variant];
    const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

    return {
        wrapper: cn(
            "relative inline-flex transform-gpu rounded-2xl p-[1px] will-change-transform",
            colors.outer,
        ),
        wrapperStyle: {
            transform: isPressed
                ? "translateY(2px) scale(0.98)"
                : "translateY(0) scale(1)",
            boxShadow: isPressed
                ? "0 1px 2px rgba(0, 0, 0, 0.2)"
                : isHovered && !isTouchDevice
                    ? "0 10px 20px -5px rgba(0, 0, 0, 0.4)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: transitionStyle,
            transformOrigin: "center center",
        },
        inner: cn(
            "absolute inset-[1px] transform-gpu rounded-2xl will-change-transform",
            colors.inner,
        ),
        innerStyle: {
            transition: transitionStyle,
            transformOrigin: "center center",
            filter:
                isHovered && !isPressed && !isTouchDevice ? "brightness(1.15)" : "none",
        },
        button: cn(
            "relative z-10 m-[1px] rounded-2xl inline-flex h-12 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-8 py-2 text-xs font-black uppercase tracking-widest leading-none will-change-transform outline-none border border-white/5",
            colors.button,
            colors.textColor,
            colors.textShadow,
        ),
        buttonStyle: {
            transform: isPressed ? "scale(0.98)" : "scale(1)",
            transition: transitionStyle,
            transformOrigin: "center center",
            filter:
                isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none",
        },
    };
};

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
                isPressed ? "opacity-30" : "opacity-0",
            )}
        >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 blur-[2px]" />
        </div>
    );
};

export const MetalButton = React.forwardRef<
    HTMLButtonElement,
    MetalButtonProps
>(({ children, className, variant = "default", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);

    React.useEffect(() => {
        setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    const buttonText = children || "Button";
    const variants = metalButtonVariants(
        variant,
        isPressed,
        isHovered,
        isTouchDevice,
    );

    const handleInternalMouseDown = () => {
        setIsPressed(true);
    };
    const handleInternalMouseUp = () => {
        setIsPressed(false);
    };
    const handleInternalMouseLeave = () => {
        setIsPressed(false);
        setIsHovered(false);
    };
    const handleInternalMouseEnter = () => {
        if (!isTouchDevice) {
            setIsHovered(true);
        }
    };
    const handleInternalTouchStart = () => {
        setIsPressed(true);
    };
    const handleInternalTouchEnd = () => {
        setIsPressed(false);
    };
    const handleInternalTouchCancel = () => {
        setIsPressed(false);
    };

    return (
        <div className={cn(variants.wrapper, className)} style={variants.wrapperStyle}>
            <div className={variants.inner} style={variants.innerStyle}></div>
            <button
                ref={ref}
                className={cn(variants.button, "w-full")}
                style={variants.buttonStyle}
                {...props}
                onMouseDown={handleInternalMouseDown}
                onMouseUp={handleInternalMouseUp}
                onMouseLeave={handleInternalMouseLeave}
                onMouseEnter={handleInternalMouseEnter}
                onTouchStart={handleInternalTouchStart}
                onTouchEnd={handleInternalTouchEnd}
                onTouchCancel={handleInternalTouchCancel}
            >
                <ShineEffect isPressed={isPressed} />
                <span className="relative z-30 italic">{buttonText}</span>
                {isHovered && !isPressed && !isTouchDevice && (
                    <div className="pointer-events-none absolute inset-0 bg-white/5 z-25" />
                )}
            </button>
        </div>
    );
});

MetalButton.displayName = "MetalButton";
