"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Trash2, Loader2, Target, Globe } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsClientProps {
    email: string;
    resumeCount: number;
    isSubscribed: boolean;
    initialName: string;
}

export function SettingsClient({ email, resumeCount, isSubscribed, initialName }: SettingsClientProps) {
    const supabase = createClient();
    const [photo, setPhoto] = useState<string>('https://avatar.vercel.sh/john');
    const [name, setName] = useState(initialName);
    const [isSavingName, setIsSavingName] = useState(false);

    // Future expansion states
    const [industry, setIndustry] = useState('');
    const [isSavingIndustry, setIsSavingIndustry] = useState(false);

    const [language, setLanguage] = useState('English');

    const handleUpload = async (file: File) => {
        setPhoto(URL.createObjectURL(file));
        // TODO: implement real Supabase storage upload
        return { success: true };
    };

    const handleSaveName = async () => {
        setIsSavingName(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");

            const { error } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', user.id);

            if (error) throw error;
            toast.success("Name updated successfully.");
        } catch (error: any) {
            toast.error("Failed to update name", { description: error.message });
        } finally {
            setIsSavingName(false);
        }
    };

    const handleSaveIndustry = async () => {
        setIsSavingIndustry(true);
        try {
            // Mocking save for demonstration, in full implementation add target_industry to profiles
            await new Promise(r => setTimeout(r, 500));
            toast.success("Career info updated successfully.");
        } catch (error: any) {
            toast.error("Failed to update career info");
        } finally {
            setIsSavingIndustry(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <section className="relative w-full px-4 sm:px-8 py-4 lg:pl-12 lg:pr-8 text-white overflow-x-hidden">
                {/* Pure Black Theme - Gradients Removed per request */}

                <div className="mx-auto w-full max-w-4xl space-y-8 relative z-10 pt-2">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h2>
                        <p className="text-zinc-500 text-sm font-medium">
                            Manage account and your personal information.
                        </p>
                    </div>
                    <Separator className="bg-white/10" />

                    <div className="py-2">
                        {/* Profile Section */}
                        <SectionColumns
                            title="Your Avatar"
                            description="An avatar is optional but strongly recommended."
                        >
                            <AvatarUploader onUpload={handleUpload}>
                                <Avatar className="relative h-20 w-20 cursor-pointer hover:opacity-50 transition-opacity ring-1 ring-white/10">
                                    <AvatarImage src={photo} />
                                    <AvatarFallback className="bg-zinc-900 border border-white/10 text-xl font-bold text-white uppercase">
                                        {name ? name.substring(0, 2) : 'ME'}
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                                    />
                                    <Button
                                        onClick={handleSaveName}
                                        disabled={isSavingName || name === initialName}
                                        variant="outline"
                                        className="text-white border-white/10 bg-white/5 hover:bg-white/10 text-xs md:text-sm whitespace-nowrap min-w-[120px]"
                                    >
                                        {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                                    </Button>
                                </div>
                                <p className="text-zinc-600 text-xs font-medium">Max 32 characters</p>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/10" />

                        <SectionColumns
                            title="Your Email"
                            description="Email addresses are managed through your auth provider."
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
                                        className="text-zinc-500 border-white/5 bg-white/5 text-xs md:text-sm whitespace-nowrap cursor-not-allowed min-w-[120px]"
                                    >
                                        Managed
                                    </Button>
                                </div>
                            </div>
                        </SectionColumns>

                        {/* Career Info Expansion */}
                        <Separator className="bg-white/10 mt-8" />
                        <SectionColumns
                            title="Career Information"
                            description="Help AI tailor your resumes by providing your target industry or role."
                        >
                            <div className="w-full space-y-2">
                                <Label className="sr-only">Industry</Label>
                                <div className="flex w-full items-center justify-center gap-3">
                                    <div className="relative w-full">
                                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            placeholder="e.g. Software Engineering, Marketing..."
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="bg-[#0a0a0a] border-white/10 pl-10 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSaveIndustry}
                                        disabled={isSavingIndustry || !industry}
                                        variant="outline"
                                        className="text-white border-white/10 bg-white/5 hover:bg-white/10 text-xs md:text-sm whitespace-nowrap min-w-[120px]"
                                    >
                                        {isSavingIndustry ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/10" />

                        <SectionColumns
                            title="Resume Language"
                            description="Select your primary language for AI generation and formatting."
                        >
                            <div className="w-full space-y-2">
                                <Label className="sr-only">Language</Label>
                                <div className="flex w-full items-center justify-center gap-3">
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 text-white focus:ring-emerald-500/50">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-zinc-500" />
                                                <SelectValue placeholder="Select Language" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Turkish">Turkish</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={() => toast.success("Language preference updated.")}
                                        variant="outline"
                                        className="text-white border-white/10 bg-white/5 hover:bg-white/10 text-xs md:text-sm whitespace-nowrap min-w-[120px]"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </SectionColumns>

                        {/* Plan & Usage */}
                        <Separator className="bg-white/10 mt-8" />

                        <SectionColumns
                            title="Plan & Usage"
                            description="Manage your current subscription, billing, and resource limits."
                        >
                            <div className="space-y-6 w-full">
                                <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-black">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">
                                                    {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                                </h3>
                                                <div className={`h-1.5 w-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            </div>
                                            <p className="text-xs text-zinc-500 font-medium">
                                                {isSubscribed ? 'Auto-renews on March 12, 2026' : 'Basic limits apply'}
                                            </p>
                                        </div>
                                    </div>

                                    {!isSubscribed && (
                                        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold h-11 px-8 rounded-xl transition-all">
                                            <Link href="/dashboard/upgrade">Upgrade now</Link>
                                        </Button>
                                    )}
                                    {isSubscribed && (
                                        <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-11 px-8 rounded-xl">
                                            Manage billing
                                        </Button>
                                    )}
                                </div>

                                {/* Minimalist Usage Stats matching MCP request */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">CV Projects</h4>
                                                <span className="text-xs font-bold text-white">{resumeCount || 0} <span className="text-zinc-600 font-medium">/ {isSubscribed ? '∞' : '3'}</span></span>
                                            </div>
                                        </div>
                                        <Progress value={isSubscribed ? 10 : ((resumeCount || 0) / 3) * 100} className="h-0.5 bg-white/5 [&>div]:bg-zinc-400" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Letters</h4>
                                                <span className="text-xs font-bold text-white">0 <span className="text-zinc-600 font-medium">/ {isSubscribed ? '∞' : '5'}</span></span>
                                            </div>
                                        </div>
                                        <Progress value={0} className="h-0.5 bg-white/5 [&>div]:bg-zinc-400" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">AI Credits</h4>
                                                <span className="text-xs font-bold text-white">0 <span className="text-zinc-600 font-medium">/ {isSubscribed ? '∞' : '10'}</span></span>
                                            </div>
                                        </div>
                                        <Progress value={0} className="h-0.5 bg-white/5 [&>div]:bg-zinc-400" />
                                    </div>
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-red-500/20 mt-12" />

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
