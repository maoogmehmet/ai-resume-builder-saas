"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AnimatedGenerateButton from '@/components/ui/animated-generate-button';
import { Progress } from '@/components/ui/progress';
import { Shield, Trash2, Loader2, Target, Globe, Save } from 'lucide-react';
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
            <section className="relative w-full px-6 sm:px-12 py-16 lg:pl-16 lg:pr-12 text-white overflow-x-hidden">
                <div className="mx-auto w-full max-w-5xl space-y-12 relative z-10 pt-2">
                    <div className="flex flex-col border-b border-white/5 pb-10">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic lowercase mb-4">settings</h1>
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest italic opacity-60">
                            architect your laboratory profile and system preferences.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Profile Section */}
                        <SectionColumns
                            title="Laboratory Avatar"
                            description="An avatar is optional but serves as your professional imprint."
                        >
                            <AvatarUploader onUpload={handleUpload}>
                                <Avatar className="relative h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity border-2 border-white/10 p-1 group">
                                    <AvatarImage src={photo} className="rounded-full overflow-hidden" />
                                    <AvatarFallback className="bg-white/5 border border-white/10 text-2xl font-black text-white uppercase italic">
                                        {name ? name.substring(0, 2) : 'LAB'}
                                    </AvatarFallback>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                                        <Save className="h-6 w-6 text-white" />
                                    </div>
                                </Avatar>
                            </AvatarUploader>
                        </SectionColumns>

                        <Separator className="bg-white/5" />

                        <SectionColumns
                            title="Identity Name"
                            description="Enter the professional name associated with your documents."
                        >
                            <div className="w-full space-y-4">
                                <Label className="sr-only">Name</Label>
                                <div className="flex w-full items-center gap-4">
                                    <Input
                                        placeholder="Identity Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-white/[0.02] border-white/10 text-white placeholder:text-zinc-700 h-12 rounded-xl focus:ring-emerald-500/20 font-medium px-5"
                                    />
                                    <AnimatedGenerateButton
                                        onClick={handleSaveName}
                                        disabled={isSavingName || name === initialName}
                                        generating={isSavingName}
                                        labelIdle="update"
                                        labelActive="syncing..."
                                        size="sm"
                                        className="font-black italic lowercase h-12 px-8 shrink-0"
                                    />
                                </div>
                                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest italic ml-1">Maximum 32 characters per identity</p>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/5" />

                        <SectionColumns
                            title="Neural Email"
                            description="Email addresses are hard-linked through your laboratory login."
                        >
                            <div className="w-full space-y-4">
                                <Label className="sr-only">Email</Label>
                                <div className="flex w-full items-center gap-4">
                                    <Input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="bg-white/[0.01] border-white/5 text-zinc-600 opacity-50 cursor-not-allowed h-12 rounded-xl px-5 italic font-medium"
                                    />
                                    <AnimatedGenerateButton
                                        disabled
                                        labelIdle="encrypted"
                                        size="sm"
                                        className="font-black italic lowercase h-12 px-8 shrink-0 opacity-40 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </SectionColumns>

                        {/* Career Info Expansion */}
                        <Separator className="bg-white/5" />
                        <SectionColumns
                            title="Neural Targeting"
                            description="Specify target industries to help AI optimize your career trajectory."
                        >
                            <div className="w-full space-y-4">
                                <Label className="sr-only">Industry</Label>
                                <div className="flex w-full items-center gap-4">
                                    <div className="relative w-full">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                                        <Input
                                            placeholder="e.g. Quantitative Engineering, Marketing..."
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="bg-white/[0.02] border-white/10 pl-12 h-12 rounded-xl text-white placeholder:text-zinc-700 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <AnimatedGenerateButton
                                        onClick={handleSaveIndustry}
                                        disabled={isSavingIndustry || !industry}
                                        generating={isSavingIndustry}
                                        labelIdle="update"
                                        labelActive="mapping..."
                                        size="sm"
                                        className="font-black italic lowercase h-12 px-8 shrink-0"
                                    />
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-white/5" />

                        <SectionColumns
                            title="Communication Mode"
                            description="Select the primary language for neural generation outputs."
                        >
                            <div className="w-full space-y-4">
                                <Label className="sr-only">Language</Label>
                                <div className="flex w-full items-center gap-4">
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-full bg-white/[0.02] border-white/10 text-white h-12 rounded-xl px-5 focus:ring-emerald-500/20 italic font-medium">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-4 w-4 text-zinc-600" />
                                                <SelectValue placeholder="System Language" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-black border-white/10 text-white shadow-2xl rounded-xl">
                                            <SelectItem value="English" className="focus:bg-white focus:text-black font-medium">English</SelectItem>
                                            <SelectItem value="Turkish" className="focus:bg-white focus:text-black font-medium">Turkish</SelectItem>
                                            <SelectItem value="German" className="focus:bg-white focus:text-black font-medium">German</SelectItem>
                                            <SelectItem value="Spanish" className="focus:bg-white focus:text-black font-medium">Spanish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <AnimatedGenerateButton
                                        onClick={() => toast.success("Language preference updated.")}
                                        labelIdle="update"
                                        size="sm"
                                        className="font-black italic lowercase h-12 px-8 shrink-0"
                                    />
                                </div>
                            </div>
                        </SectionColumns>

                        {/* Plan & Usage */}
                        <Separator className="bg-white/5" />

                        <SectionColumns
                            title="Protocols & Usage"
                            description="Manage your subscription status and laboratory resource limits with precision metrics."
                        >
                            <div className="space-y-12 w-full">
                                <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-[2.5rem] p-10 md:p-14 flex flex-col sm:flex-row items-center justify-between gap-10 w-full shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03)_0,transparent_60%)] pointer-events-none" />

                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 rotate-0">
                                            <Shield className="h-10 w-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-black text-white text-4xl uppercase italic tracking-tighter leading-none">
                                                    {isSubscribed ? 'Pro Node' : 'Free Tier'}
                                                </h3>
                                                <div className={`h-3 w-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] ${isSubscribed ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                                            </div>
                                            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.4em] italic leading-none">
                                                {isSubscribed ? 'accessing unlimited neural bandwidth' : 'access restricted to trial parameters'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        {!isSubscribed ? (
                                            <AnimatedGenerateButton
                                                href="/dashboard/upgrade"
                                                labelIdle="upgrade pulse"
                                                size="lg"
                                                className="font-black italic lowercase px-14 h-16 shadow-2xl shadow-emerald-500/10"
                                                noMinWidth
                                            />
                                        ) : (
                                            <AnimatedGenerateButton
                                                labelIdle="manage protocol"
                                                size="lg"
                                                className="font-black italic lowercase px-14 h-16"
                                                highlightHueDeg={200}
                                                noMinWidth
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Usage Stats - High tech grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-4">
                                    <MetricItem
                                        label="CV Logic"
                                        value={resumeCount || 0}
                                        total={isSubscribed ? '∞' : '3'}
                                        percent={isSubscribed ? 10 : ((resumeCount || 0) / 3) * 100}
                                    />
                                    <MetricItem
                                        label="Letters"
                                        value={0}
                                        total={isSubscribed ? '∞' : '5'}
                                        percent={0}
                                    />
                                    <MetricItem
                                        label="AI Units"
                                        value={0}
                                        total={isSubscribed ? '∞' : '10'}
                                        percent={0}
                                    />
                                </div>
                            </div>
                        </SectionColumns>

                        <Separator className="bg-red-500/10" />

                        <SectionColumns
                            title={
                                <span className="flex items-center gap-2 text-red-500 uppercase font-black italic tracking-tighter">
                                    Erasure Zone
                                </span>
                            }
                            description="Permanently remove your identity and all laboratory data. Irreversible."
                        >
                            <div className="bg-red-500/[0.01] border border-red-500/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 w-full mt-2">
                                <div className="space-y-2 text-center sm:text-left">
                                    <h3 className="font-black text-white text-xl uppercase italic tracking-tighter">Delete Identity</h3>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed max-w-[280px] italic">Wipe all neural nodes associated with this account.</p>
                                </div>

                                <AnimatedGenerateButton
                                    labelIdle="erase data"
                                    size="lg"
                                    highlightHueDeg={0} // Red
                                    className="font-black italic lowercase"
                                    icon={<Trash2 className="h-4 w-4" />}
                                    noMinWidth
                                />
                            </div>
                        </SectionColumns>
                    </div>
                </div>
            </section>
        </div>
    );
}

function MetricItem({ label, value, total, percent }: { label: string, value: number, total: string, percent: number }) {
    return (
        <div className="space-y-5 group">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-zinc-700 tracking-[0.5em] uppercase italic group-hover:text-zinc-500 transition-colors">{label}</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</span>
                        <span className="text-zinc-800 font-bold text-xs uppercase tracking-widest">/ {total}</span>
                    </div>
                </div>
            </div>
            <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="absolute inset-y-0 left-0 bg-white/40 group-hover:bg-white/60 transition-colors"
                />
            </div>
        </div>
    )
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
        <div className="animate-in fade-in grid grid-cols-1 gap-x-12 gap-y-8 pt-4 pb-4 duration-700 md:grid-cols-10">
            <div className="w-full space-y-3 md:col-span-4 max-w-sm">
                <h2 className="text-2xl italic tracking-tighter font-black text-white uppercase leading-none">
                    {title}
                </h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic leading-relaxed opacity-60">
                    {description}
                </p>
            </div>
            <div className={cn('md:col-span-6 flex items-start w-full', className)}>{children}</div>
        </div>
    );
}
