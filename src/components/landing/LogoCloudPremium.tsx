'use client';
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    label?: string;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloudPremium({ className, logos, ...props }: LogoCloudProps) {
    return (
        <div
            {...props}
            className={cn(
                "overflow-hidden py-12 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
                className
            )}
        >
            <div className="flex flex-col items-center mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-2">Trusted by candidates from</p>
                <div className="h-px w-12 bg-emerald-500/20" />
            </div>
            <InfiniteSlider gap={80} reverse duration={40} durationOnHover={10}>
                {logos.map((logo) => (
                    <div key={`logo-${logo.alt}`} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500 group cursor-default">
                        {logo.src ? (
                            <img
                                alt={logo.alt}
                                className="h-6 select-none grayscale invert brightness-0"
                                height={logo.height || "auto"}
                                loading="lazy"
                                src={logo.src}
                                width={logo.width || "auto"}
                            />
                        ) : null}
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic group-hover:text-emerald-400 transition-colors">{logo.label || logo.alt}</span>
                    </div>
                ))}
            </InfiniteSlider>
        </div>
    );
}
