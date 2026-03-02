"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface VerticalCutRevealProps {
    children: string;
    splitBy?: "words" | "characters";
    staggerDuration?: number;
    staggerFrom?: "first" | "last" | "center";
    reverse?: boolean;
    containerClassName?: string;
    transition?: any;
}

export function VerticalCutReveal({
    children,
    splitBy = "words",
    staggerDuration = 0.1,
    staggerFrom = "first",
    reverse = false,
    containerClassName,
    transition,
}: VerticalCutRevealProps) {
    const items = splitBy === "words" ? children.split(" ") : children.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: staggerDuration, delayChildren: i * 0.1 },
        }),
    };

    const child = {
        visible: {
            y: 0,
            opacity: 1,
            transition: transition || {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            y: "100%",
            opacity: 0,
        },
    };

    return (
        <div className={cn("flex flex-wrap overflow-hidden", containerClassName)}>
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap"
            >
                {items.map((item, index) => (
                    <div key={index} className="overflow-hidden mr-[0.25em]">
                        <motion.span variants={child} className="inline-block">
                            {item === " " ? "\u00A0" : item}
                        </motion.span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
