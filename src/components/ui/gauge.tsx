"use client"

import React, { useEffect, useState } from "react"

const sizes = {
    tiny: 20,
    small: 32,
    medium: 64,
    large: 180 // Increased slightly for impact
};

type TArcPriority = "default" | "equal";

interface GaugeProps {
    size?: keyof typeof sizes;
    value: number;
    colors?: { [name: string]: string };
    showValue?: boolean;
    arcPriority?: TArcPriority;
    indeterminate?: boolean;
    className?: string;
    animated?: boolean;
    label?: string; // Optinal label like "Score"
}

const gapPercent = {
    tiny: 9,
    small: 6,
    medium: 5,
    large: 5
};

const defaultColors = {
    "0": "#ef4444",
    "34": "#f59e0b",
    "68": "#10b981"
};

export const Gauge = ({
    size = "medium",
    value,
    colors = defaultColors,
    showValue = false,
    arcPriority = "default",
    indeterminate = false,
    className = "",
    animated = true,
    label = "ATS SCORE"
}: GaugeProps) => {
    const r = size === "tiny" ? 42.5 : 45;
    const circumference = 2 * r * Math.PI;

    // Animated value
    const [displayValue, setDisplayValue] = useState(animated ? 0 : value)
    const [animatedStroke, setAnimatedStroke] = useState(animated ? 0 : value)

    useEffect(() => {
        if (!animated) {
            setDisplayValue(value)
            setAnimatedStroke(value)
            return
        }

        const duration = 2000 // Slower for premium feel
        const startTime = Date.now()
        const startVal = 0

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // cubic-bezier(.16,1,.3,1) / easeOutExpo equivalent
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const current = Math.floor(startVal + (value - startVal) * eased)
            setDisplayValue(current)
            setAnimatedStroke(startVal + (value - startVal) * eased)
            if (progress >= 1) clearInterval(timer)
        }, 16)

        return () => clearInterval(timer)
    }, [value, animated])

    // Find the color based on the value
    const colorKeys = Object.keys(colors).map(Number).sort((a, b) => b - a);
    const colorKey = colorKeys.find(key => key <= value) || colorKeys[colorKeys.length - 1];
    const primary = colors?.primary || colors[colorKey.toString()];

    const primaryDash = arcPriority === "default"
        ? (circumference * animatedStroke / 100)
        : ((circumference * (100 - 2 * gapPercent[size]) / 100) / 2)

    const secondaryDash = indeterminate
        ? circumference
        : arcPriority === "default"
            ? (circumference * (100 - (animatedStroke === 0 ? 0 : (2 * gapPercent[size])) - animatedStroke) / 100)
            : ((circumference * (100 - 2 * gapPercent[size]) / 100) / 2)

    return (
        <div
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={value}
            className={`relative flex items-center justify-center ${className}`}
            role="progressbar"
        >
            <svg
                aria-hidden="true"
                fill="none"
                height={sizes[size]}
                width={sizes[size]}
                viewBox="0 0 100 100"
                className="overflow-visible"
            >
                {/* Glow filter */}
                <defs>
                    <filter id="premium-glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={primary} stopOpacity="1" />
                        <stop offset="100%" stopColor={primary} stopOpacity="0.6" />
                    </linearGradient>
                </defs>

                {/* Inner glass shadow circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={r - 4}
                    fill="url(#primary-grad)"
                    fillOpacity="0.03"
                    className="animate-pulse"
                    style={{ animationDuration: '4s' }}
                />

                {/* Background (Ghost) Track */}
                <circle
                    cx="50"
                    cy="50"
                    r={r}
                    strokeWidth="8"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        transform: arcPriority === "equal"
                            ? `scaleY(-1) rotate(calc(-90deg + (0.5 * ${gapPercent[size]} * 3.6deg)))`
                            : `scaleY(-1) rotate(calc(1turn - 90deg - (${gapPercent[size]} * 3.6deg)))`,
                        transformOrigin: 'center',
                    }}
                    className="stroke-white/[0.03]"
                    strokeDasharray={`${secondaryDash} ${circumference}`}
                />

                {/* Active Progression Track */}
                {(animatedStroke > 0 || arcPriority === "equal") && !indeterminate && (
                    <circle
                        cx="50"
                        cy="50"
                        r={r}
                        strokeWidth="8"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center',
                        }}
                        stroke={`url(#primary-grad)`}
                        strokeDasharray={`${primaryDash} ${circumference}`}
                        filter="url(#premium-glow)"
                    />
                )}
            </svg>

            {/* Central Value Display */}
            {showValue && size !== "tiny" && !indeterminate && (
                <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                    <div className="flex items-baseline gap-0.5">
                        <span className={`text-white font-black tracking-tight tabular-nums ${{
                            small: "text-lg",
                            medium: "text-3xl",
                            large: "text-6xl"
                        }[size]}`}>
                            {displayValue}
                        </span>
                        <span className={`text-white/40 font-bold ${{
                            small: "text-[8px]",
                            medium: "text-xs",
                            large: "text-xl"
                        }[size]}`}>
                            %
                        </span>
                    </div>
                    {size === "large" && (
                        <span className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase mt-[-4px]">
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
