"use client";

import { motion, useSpring } from "framer-motion";
import React, {
    useState,
    useRef,
    useEffect,
    createContext,
    useContext,
} from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Check, Star as LucideStar } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITY FUNCTIONS ---

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function useMediaQuery(query: string) {
    const [value, setValue] = useState(false);

    useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }

        const result = matchMedia(query);
        result.addEventListener("change", onChange);
        setValue(result.matches);

        return () => result.removeEventListener("change", onChange);
    }, [query]);

    return value;
}

// --- BASE UI COMPONENTS (BUTTON) ---

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

// --- INTERACTIVE STARFIELD ---

function Star({
    mousePosition,
    containerRef,
}: {
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [initialPos] = useState({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
    });

    const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        if (
            !containerRef.current ||
            mousePosition.x === null ||
            mousePosition.y === null
        ) {
            springX.set(0);
            springY.set(0);
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const starX =
            containerRect.left +
            (parseFloat(initialPos.left) / 100) * containerRect.width;
        const starY =
            containerRect.top +
            (parseFloat(initialPos.top) / 100) * containerRect.height;

        const deltaX = mousePosition.x - starX;
        const deltaY = mousePosition.y - starY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const radius = 600; // Radius of magnetic influence

        if (distance < radius) {
            const force = 1 - distance / radius;
            const pullX = deltaX * force * 0.5;
            const pullY = deltaY * force * 0.5;
            springX.set(pullX);
            springY.set(pullY);
        } else {
            springX.set(0);
            springY.set(0);
        }
    }, [mousePosition, initialPos, containerRef, springX, springY]);

    return (
        <motion.div
            className="absolute bg-white rounded-full"
            style={{
                top: initialPos.top,
                left: initialPos.left,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                x: springX,
                y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
            }}
        />
    );
}

function InteractiveStarfield({
    mousePosition,
    containerRef,
}: {
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            {Array.from({ length: 150 }).map((_, i) => (
                <Star
                    key={`star-${i}`}
                    mousePosition={mousePosition}
                    containerRef={containerRef}
                />
            ))}
        </div>
    );
}

// --- PRICING COMPONENT LOGIC ---

// Interfaces
interface PricingPlan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: string[];
    description: string;
    buttonText: string;
    href: string;
    isPopular?: boolean;
}

interface PricingSectionProps {
    plans: PricingPlan[];
    title?: string;
    description?: string;
}

// Context for state management
const PricingContext = createContext<{
    isMonthly: boolean;
    setIsMonthly: (value: boolean) => void;
}>({
    isMonthly: true,
    setIsMonthly: () => { },
});

// Main PricingSection Component
export function PricingPremium({
    plans,
    title = "Simple, Transparent Pricing",
    description = "Choose the plan that's right for you. All plans include our core features and support.",
}: PricingSectionProps) {
    const [isMonthly, setIsMonthly] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState<{
        x: number | null;
        y: number | null;
    }>({ x: null, y: null });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
    };

    return (
        <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
            <section
                id="pricing"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMousePosition({ x: null, y: null })}
                className="relative w-full bg-black py-24 sm:py-32 overflow-hidden border-b border-white/5"
            >
                <InteractiveStarfield
                    mousePosition={mousePosition}
                    containerRef={containerRef}
                />
                <div className="relative z-10 container mx-auto px-6 md:px-12">
                    <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
                        <h2 className="text-4xl font-black tracking-tighter sm:text-7xl text-white italic">
                            {title}
                        </h2>
                        <p className="text-zinc-500 text-lg sm:text-xl font-medium whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                    <PricingToggle />
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto items-start gap-12">
                        {plans.map((plan, index) => (
                            <PricingCard key={index} plan={plan} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </PricingContext.Provider>
    );
}

// Pricing Toggle Component
function PricingToggle() {
    const { isMonthly, setIsMonthly } = useContext(PricingContext);
    const confettiRef = useRef<HTMLDivElement>(null!);
    const monthlyBtnRef = useRef<HTMLButtonElement>(null);
    const annualBtnRef = useRef<HTMLButtonElement>(null);

    const [pillStyle, setPillStyle] = useState({});

    useEffect(() => {
        const btnRef = isMonthly ? monthlyBtnRef : annualBtnRef;
        if (btnRef.current) {
            setPillStyle({
                width: btnRef.current.offsetWidth,
                transform: `translateX(${btnRef.current.offsetLeft}px)`,
            });
        }
    }, [isMonthly]);

    const handleToggle = (monthly: boolean) => {
        if (isMonthly === monthly) return;
        setIsMonthly(monthly);

        if (!monthly && confettiRef.current) {
            const rect = annualBtnRef.current?.getBoundingClientRect();
            if (!rect) return;

            const originX = (rect.left + rect.width / 2) / window.innerWidth;
            const originY = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 80,
                spread: 80,
                origin: { x: originX, y: originY },
                colors: [
                    "#ffffff",
                    "#10b981", // emerald-500
                    "#000000",
                ],
                ticks: 300,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
            });
        }
    };

    return (
        <div className="flex justify-center">
            <div ref={confettiRef} className="relative flex w-fit items-center rounded-2xl bg-white/5 border border-white/5 p-1.5 backdrop-blur-md">
                <motion.div
                    className="absolute left-0 top-0 h-full rounded-[0.8rem] bg-white p-1"
                    style={pillStyle}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
                <button
                    ref={monthlyBtnRef}
                    onClick={() => handleToggle(true)}
                    className={cn(
                        "relative z-10 rounded-xl px-6 sm:px-8 py-2.5 text-xs font-black uppercase tracking-widest transition-colors",
                        isMonthly
                            ? "text-black"
                            : "text-zinc-500 hover:text-white",
                    )}
                >
                    Monthly
                </button>
                <button
                    ref={annualBtnRef}
                    onClick={() => handleToggle(false)}
                    className={cn(
                        "relative z-10 rounded-xl px-6 sm:px-8 py-2.5 text-xs font-black uppercase tracking-widest transition-colors",
                        !isMonthly
                            ? "text-black"
                            : "text-zinc-500 hover:text-white",
                    )}
                >
                    Annual
                    <span
                        className={cn(
                            "ml-2 text-[10px] opacity-70",
                            !isMonthly ? "" : "text-emerald-500",
                        )}
                    >
                        Save 20%
                    </span>
                </button>
            </div>
        </div>
    );
}

// Pricing Card Component
function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
    const { isMonthly } = useContext(PricingContext);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{
                y: plan.isPopular && isDesktop ? -20 : 0,
                opacity: 1,
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.15,
            }}
            className={cn(
                "rounded-[3rem] p-12 flex flex-col relative transition-all duration-500",
                plan.isPopular
                    ? "bg-[#0a0a0a] border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.05)] scale-105 z-10"
                    : "bg-black border border-white/5 hover:border-white/10",
            )}
        >
            {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <div className="bg-emerald-500 py-1.5 px-5 rounded-full flex items-center gap-2 shadow-2xl shadow-emerald-500/20">
                        <LucideStar className="text-black h-3.5 w-3.5 fill-current" />
                        <span className="text-black text-[10px] font-black uppercase tracking-[0.2em]">
                            Most Popular
                        </span>
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col items-center text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">{plan.name}</h3>

                <div className="flex items-baseline justify-center gap-x-2 mb-4">
                    <span className="text-7xl font-black tracking-tighter text-white">
                        {plan.price === "FREE" ? (
                            "FREE"
                        ) : (
                            <NumberFlow
                                value={
                                    isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                                }
                                format={{
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 0,
                                }}
                                className="font-variant-numeric: tabular-nums"
                            />
                        )}
                    </span>
                    {plan.price !== "FREE" && (
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
                            / {plan.period}
                        </span>
                    )}
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 mb-10">
                    {plan.price === "FREE" ? "Forever Free" : isMonthly ? "Billed Monthly" : "Billed Annually"}
                </p>

                <p className="text-sm font-bold text-zinc-500 mb-12 max-w-[240px] leading-relaxed">
                    {plan.description}
                </p>

                <ul
                    role="list"
                    className="w-full space-y-5 text-left mb-16"
                >
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-4 text-sm font-bold text-zinc-400 group">
                            <div className={cn(
                                "h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                plan.isPopular ? "bg-emerald-500" : "border border-white/10 bg-white/5"
                            )}>
                                <Check
                                    className={cn("h-3.5 w-3.5", plan.isPopular ? "text-black font-black" : "text-zinc-600")}
                                    aria-hidden="true"
                                />
                            </div>
                            <span className={cn(plan.isPopular ? "text-white" : "text-zinc-500")}>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="w-full mt-auto">
                    <Link
                        href={plan.href}
                        className={cn(
                            buttonVariants({
                                variant: plan.isPopular ? "default" : "outline",
                                size: "lg",
                            }),
                            "w-full h-16 rounded-2xl text-base font-black transition-all active:scale-[0.98] border-none shadow-2xl",
                            plan.isPopular
                                ? "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                                : "bg-white/5 border-white/5 text-white hover:bg-white/10 shadow-black/50"
                        )}
                    >
                        {plan.buttonText}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
