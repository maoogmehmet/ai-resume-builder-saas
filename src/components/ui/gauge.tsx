"use client"

import React, { useEffect, useState } from "react"

const sizes = {
    tiny: 20,
    small: 32,
    medium: 64,
    large: 160
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

        const duration = 1500
        const startTime = Date.now()
        const startVal = 0

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutExpo
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
            className={`relative ${className}`}
            role="progressbar"
        >
            <svg
                aria-hidden="true"
                fill="none"
                height={sizes[size]}
                width={sizes[size]}
                viewBox="0 0 100 100"
                strokeWidth="2"
            >
                {/* Glow filter */}
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={r}
                    strokeWidth="10"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        transform: arcPriority === "equal"
                            ? `scaleY(-1) rotate(calc(-90deg + (0.5 * ${gapPercent[size]} * 3.6deg)))`
                            : `scaleY(-1) rotate(calc(1turn - 90deg - (${gapPercent[size]} * 3.6deg)))`,
                        transformOrigin: 'center',
                    }}
                    className={!colors?.secondary ? "stroke-zinc-800" : ""}
                    stroke={colors.secondary}
                    strokeDasharray={`${secondaryDash} ${circumference}`}
                />

                {/* Primary arc with glow */}
                {(animatedStroke > 0 || arcPriority === "equal") && !indeterminate && (
                    <circle
                        cx="50"
                        cy="50"
                        r={r}
                        strokeWidth="10"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center',
                        }}
                        stroke={primary}
                        strokeDasharray={`${primaryDash} ${circumference}`}
                        filter="url(#glow)"
                    />
                )}
            </svg>

            {/* Value with animated counter */}
            {showValue && size !== "tiny" && !indeterminate && (
                <div aria-hidden="true" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p className={`text-white font-sans tabular-nums ${{
                        small: "text-[11px] font-medium",
                        medium: "text-[18px] font-medium",
                        large: "text-[42px] font-bold"
                    }[size]}`}>
                        {displayValue}
                    </p>
                </div>
            )}
            {indeterminate && (
                <div aria-hidden="true" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                        height={sizes[size] / 2}
                        width={sizes[size] / 2}
                        viewBox="0 0 16 16"
                        strokeLinejoin="round"
                        className="animate-pulse"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.51324 3.62367L3.76375 8.34731C3.61845 8.7396 3.24433 8.99999 2.826 8.99999H0.75H0V7.49999H0.75H2.47799L4.56666 1.86057C4.88684 0.996097 6.10683 0.988493 6.43776 1.84891L10.5137 12.4463L12.2408 8.1286C12.3926 7.74894 12.7604 7.49999 13.1693 7.49999H15.25H16V8.99999H15.25H13.5078L11.433 14.1868C11.0954 15.031 9.8976 15.023 9.57122 14.1744L5.51324 3.62367Z"
                            fill="#71717a"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};
