import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
    return (
        <div
            {...props}
            className={cn(
                "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
                className
            )}
        >
            <InfiniteSlider gap={42} reverse duration={40} durationOnHover={20}>
                {logos.map((logo) => (
                    <div key={`logo-${logo.alt}`} className="flex items-center gap-2 group px-8">
                        <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <div className="h-2 w-2 rounded-full bg-white/40 group-hover:bg-emerald-400 transition-colors" />
                        </div>
                        <span className="text-sm font-bold tracking-tighter text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase italic">{logo.alt}</span>
                    </div>
                ))}
            </InfiniteSlider>
        </div>
    );
}
