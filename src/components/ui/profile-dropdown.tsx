"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { signout } from '@/app/auth/actions';

const Gemini = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        height="1em"
        style={{ flex: "none", lineHeight: 1 }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        {...props}
    >
        <title>{"Gemini"}</title>
        <defs>
            <linearGradient id="lobe-icons-gemini-fill" x1="0%" x2="68.73%" y1="100%" y2="30.395%">
                <stop offset="0%" stopColor="#1C7DFF" />
                <stop offset="52.021%" stopColor="#1C69FF" />
                <stop offset="100%" stopColor="#F0DCD6" />
            </linearGradient>
        </defs>
        <path
            d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
            fill="url(#lobe-icons-gemini-fill)"
            fillRule="nonzero"
        />
    </svg>
);

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    showTopbar?: boolean;
}

export function ProfileDropdown({ className, ...props }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [userName, setUserName] = React.useState("User");
    const [userEmail, setUserEmail] = React.useState("");
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const [subscription, setSubscription] = React.useState("Free");

    React.useEffect(() => {
        const loadProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserEmail(user.email || "");

            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, avatar_url, subscription_tier")
                .eq("id", user.id)
                .single();

            if (profile) {
                setUserName(profile.full_name || user.email?.split("@")[0] || "User");
                setAvatarUrl(profile.avatar_url || null);
                setSubscription(profile.subscription_tier === "pro" ? "PRO" : "Free");
            } else {
                setUserName(user.email?.split("@")[0] || "User");
            }
        };
        loadProfile();
    }, []);

    const menuItems: MenuItem[] = [
        { label: "Profile", href: "/dashboard/settings", icon: <User className="w-4 h-4" /> },
        { label: "Model", value: "Gemini 2.0", href: "#", icon: <Gemini className="w-4 h-4" /> },
        { label: "Subscription", value: subscription, href: "/dashboard/upgrade", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
        { label: "Terms & Policies", href: "/terms", icon: <FileText className="w-4 h-4" /> },
    ];

    const initials = userName.slice(0, 2).toUpperCase();

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200 focus:outline-none w-full"
                        >
                            {/* Avatar — same size as sidebar icons */}
                            <div className="relative shrink-0">
                                <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-500 flex items-center justify-center">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={userName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[9px] font-black text-white">{initials}</span>
                                    )}
                                </div>
                                {/* Online dot */}
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                            </div>
                            <div className="text-left flex-1 overflow-hidden">
                                <div className="text-[11px] font-black text-zinc-200 tracking-tight leading-tight truncate uppercase italic">
                                    {userName}
                                </div>
                                <div className="text-[9px] text-zinc-600 tracking-tight leading-tight truncate font-bold uppercase">
                                    {subscription}
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        side="top"
                        sideOffset={8}
                        className="w-60 p-2 bg-zinc-950/98 backdrop-blur-xl border border-white/8 rounded-2xl shadow-2xl shadow-black/50"
                    >
                        {/* User info header */}
                        <div className="px-3 py-3 mb-1 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-500 flex items-center justify-center shrink-0">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[11px] font-black text-white">{initials}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-black text-white tracking-tight uppercase italic leading-tight truncate">{userName}</p>
                                    <p className="text-[9px] text-zinc-500 font-bold truncate">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-0.5 py-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex items-center p-2.5 hover:bg-white/[0.06] rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-white/5"
                                    >
                                        <div className="flex items-center gap-2.5 flex-1">
                                            <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{item.icon}</span>
                                            <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-white transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        {item.value && (
                                            <span className={cn(
                                                "text-[9px] font-black rounded px-2 py-0.5 tracking-wider uppercase",
                                                item.label === "Model"
                                                    ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                                                    : "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                                            )}>
                                                {item.value}
                                            </span>
                                        )}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-1 bg-white/5" />

                        <DropdownMenuItem asChild>
                            <form action={signout} className="w-full">
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-2.5 p-2.5 bg-red-500/8 rounded-xl hover:bg-red-500/15 cursor-pointer border border-transparent hover:border-red-500/20 transition-all group"
                                >
                                    <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                                    <span className="text-[11px] font-black text-red-500 uppercase tracking-widest group-hover:text-red-400">Sign Out</span>
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}
