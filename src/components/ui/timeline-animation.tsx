"use client";
import { cn } from "@/lib/utils";
import { useInView, motion } from "framer-motion";
import React, { useRef } from "react";

interface TimelineContentProps {
    children: React.ReactNode;
    animationNum: number;
    timelineRef: React.RefObject<HTMLDivElement | null>;
    customVariants?: any;
    className?: string;
    as?: any;
}

export function TimelineContent({
    children,
    animationNum,
    timelineRef,
    customVariants,
    className,
    as: Component = "div",
}: TimelineContentProps) {
    const defaultVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: animationNum * 0.1,
            },
        },
    };

    const variants = customVariants || defaultVariants;
    const inView = useInView(timelineRef, { once: true, margin: "-100px" });

    return (
        <Component
            as={motion[Component as keyof typeof motion] ? undefined : undefined}
            className={className}
        >
            <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={variants}
                custom={animationNum}
            >
                {children}
            </motion.div>
        </Component>
    );
}
