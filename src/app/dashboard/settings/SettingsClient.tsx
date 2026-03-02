"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SettingsClientProps {
    email: string;
    resumeCount: number;
    isSubscribed: boolean;
}

export function SettingsClient({ email, resumeCount, isSubscribed }: SettingsClientProps) {
    const [photo, setPhoto] = React.useState<string>('https://avatar.vercel.sh/john');

    const handleUpload = async (file: File) => {
        setPhoto(URL.createObjectURL(file));
        return { success: true };
    };

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <section className="relative w-full px-4 sm:px-8 py-10 lg:pl-12 lg:pr-8 text-white overflow-x-hidden">
                {/* Background Gradients from snippet adapted for Tailwind v3 */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 isolate z-0 opacity-80 pointer-events-none"
                >
                    <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.01)_80%)] absolute top-0 left-0 h-[800px] w-[350px] -translate-y-[218px] -rotate-45 rounded-full" />
                    <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[800px] w-[150px] translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full" />
                    <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.01)_80%,transparent_100%)] absolute top-0 left-0 h-[800px] w-[150px] -translate-y-[218px] -rotate-45 rounded-full" />
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-8 relative z-10 pt-[2vh]">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h2>
                        <p className="text-zinc-500 text-sm font-medium">
                            Manage account and your personal information.
                        </p>
                    </div>
                    <Separator className="bg-white/10" />

                    <div className="py-2">
                        <SectionColumns
                            title="Your Avatar"
                            description="An avatar is optional but strongly recommended."
                        >
                            <AvatarUploader onUpload={handleUpload}>
                                <Avatar className="relative h-20 w-20 cursor-pointer hover:opacity-50 transition-opacity ring-1 ring-white/10">
                                    <AvatarImage src={photo} />
                                    <AvatarFallback className="bg-zinc-900 border border-white/10 text-xl font-bold text-white">
                                        ME
                                    </AvatarFallback>
                                </Avatar>
                            </AvatarUploader>
                        </SectionColumns>

                        <Separator className="bg-white/10" />

                        <SectionColumns
                            title="Your Name"
                            description="Please enter a display name you are comfortable with."
                        >
                            <div className="w-full space-y-2">
                                <Label className="sr-only">Name</Label>
                                <div className="flex w-full items-center justify-center gap-3">
                                    <Input
                                        placeholder="Enter Your Name"
                                        className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                                    />
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className="text-white border-white/10 bg-white/5 hover:bg-white/10 text-xs md:text-sm whitespace-nowrap"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                                <p className="text-zinc-600 text-xs font-medium">Max 32 characters</p>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/10" />

                        <SectionColumns
                            title="Your Email"
                            description="Please enter a Primary Email Address."
                        >
                            <div className="w-full space-y-2">
                                <Label className="sr-only">Email</Label>
                                <div className="flex w-full items-center justify-center gap-3">
                                    <Input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="bg-[#0a0a0a] border-white/10 text-zinc-400 opacity-80 cursor-not-allowed"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled
                                        className="text-zinc-500 border-white/5 bg-white/5 text-xs md:text-sm whitespace-nowrap cursor-not-allowed"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/10 mt-8" />

                        <SectionColumns
                            title="Plan & Usage"
                            description="Manage your current subscription, billing, and resource limits."
                        >
                            <div className="space-y-6 w-full">
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">
                                                    {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                                </h3>
                                                <div className={`h-1.5 w-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-zinc-700 shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`} />
                                            </div>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {isSubscribed ? 'Auto-renews on March 12, 2026' : 'Basic limits apply'}
                                            </p>
                                        </div>
                                    </div>

                                    {!isSubscribed && (
                                        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold h-11 px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                                            <Link href="/dashboard/upgrade">Upgrade now</Link>
                                        </Button>
                                    )}
                                    {isSubscribed && (
                                        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-11 px-8 rounded-xl">
                                            Manage billing
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6">
                                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">CV Projects</h4>
                                            <span className="text-xs font-bold text-white break-keep whitespace-nowrap">{resumeCount || 0} <span className="text-zinc-600">/ {isSubscribed ? '∞' : '3'}</span></span>
                                        </div>
                                        <Progress value={isSubscribed ? 10 : ((resumeCount || 0) / 3) * 100} className="h-1 bg-white/5 [&>div]:bg-white" />
                                    </div>
                                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Letters</h4>
                                            <span className="text-xs font-bold text-white break-keep whitespace-nowrap">0 <span className="text-zinc-600">/ {isSubscribed ? '∞' : '5'}</span></span>
                                        </div>
                                        <Progress value={0} className="h-1 bg-white/5 [&>div]:bg-white" />
                                    </div>
                                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">AI Credits</h4>
                                            <span className="text-xs font-bold text-white break-keep whitespace-nowrap">0 <span className="text-zinc-600">/ {isSubscribed ? '∞' : '10'}</span></span>
                                        </div>
                                        <Progress value={0} className="h-1 bg-white/5 [&>div]:bg-white" />
                                    </div>
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-red-500/20 mt-8" />

                        <SectionColumns
                            title={
                                <span className="flex items-center gap-2 text-red-500">
                                    Danger Zone
                                </span>
                            }
                            description="Permanently remove your account and all associated data. This action is irreversible."
                            className="mt-2"
                        >
                            <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full mt-2">
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="font-bold text-white text-base">Delete Account</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">Permanently remove your account and data.</p>
                                </div>

                                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold h-11 px-6 md:px-8 rounded-xl whitespace-nowrap shrink-0 border border-red-500/20">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                                </Button>
                            </div>
                        </SectionColumns>
                    </div>
                </div>
            </section>
        </div>
    );
}

interface SectionColumnsType {
    title: React.ReactNode | string;
    description?: string;
    className?: string;
    children: React.ReactNode;
}

function SectionColumns({
    title,
    description,
    children,
    className,
}: SectionColumnsType) {
    return (
        <div className="animate-in fade-in grid grid-cols-1 gap-x-10 gap-y-6 pt-10 pb-4 duration-500 md:grid-cols-10">
            <div className="w-full space-y-2 md:col-span-4 max-w-sm">
                <h2 className="font-heading text-lg leading-tight font-bold text-white">
                    {title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
            <div className={cn('md:col-span-6 flex items-start w-full', className)}>{children}</div>
        </div>
    );
}
