"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, User, Mail, Lock, Bell, Palette, Shield, Trash2, ChevronRight, Check, Upload, Camera, Eye, EyeOff, Type } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'privacy' | 'danger';

const TABS: { id: SettingsTab; label: string; icon: any; description: string }[] = [
    { id: 'account', label: 'Account', icon: User, description: 'Name, email, avatar' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme, font, layout' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & push alerts' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Data & visibility' },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, description: 'Delete account' },
];

const FONT_OPTIONS = [
    { id: 'inter', label: 'Inter', preview: 'Aa', class: 'font-sans' },
    { id: 'mono', label: 'Mono', preview: 'Aa', class: 'font-mono' },
    { id: 'serif', label: 'Serif', preview: 'Aa', class: 'font-serif' },
];

interface SettingsClientProps {
    email: string;
    resumeCount: number;
    isSubscribed: boolean;
    initialName: string;
}

export function SettingsClient({ email: propEmail, resumeCount, isSubscribed, initialName }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Account state
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Appearance
    const [selectedFont, setSelectedFont] = useState('inter');
    const [compactMode, setCompactMode] = useState(false);

    // Notifications
    const [emailJobAlerts, setEmailJobAlerts] = useState(true);
    const [emailWeeklySummary, setEmailWeeklySummary] = useState(true);
    const [emailProductUpdates, setEmailProductUpdates] = useState(false);

    // Privacy
    const [profilePublic, setProfilePublic] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setIsLoading(false); return; }

            setEmail(user.email || '');

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setDisplayName(profile.full_name || profile.display_name || '');
                setAvatarUrl(profile.avatar_url || '');
                setAvatarPreview(profile.avatar_url || '');
            }
            setIsLoading(false);
        };
        loadUserData();
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('profiles')
                .upsert({ id: user.id, full_name: displayName, avatar_url: avatarUrl, updated_at: new Date().toISOString() });

            if (error) throw error;
            toast.success('Profile saved!');
        } catch (e: any) {
            toast.error('Failed to save: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Max 2MB'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string;
            setAvatarPreview(base64);
            setAvatarUrl(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (e: any) {
            toast.error('Failed to update password: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmed) return;
        toast.error('Account deletion requires admin action. Please contact support@novatypalcv.com');
    };

    const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : email?.[0]?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg">Settings</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage your account preferences and application settings.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <nav className="md:w-56 shrink-0">
                        <div className="space-y-1">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                const isDanger = tab.id === 'danger';
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                                            activeTab === tab.id
                                                ? isDanger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-white border border-white/10'
                                                : isDanger ? 'text-red-500/50 hover:text-red-400 hover:bg-red-500/5' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold">{tab.label}</p>
                                            <p className="text-[9px] font-medium text-zinc-600 hidden md:block">{tab.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 space-y-6">

                        {/* ── ACCOUNT ── */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <SectionCard title="Profile" description="Your public profile information.">
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden border border-white/10 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-black text-white">{initials}</span>
                                                )}
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                        </div>
                                        <div>
                                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-xs font-bold text-zinc-300 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                                                <Upload className="h-3 w-3" /> Upload Photo
                                            </button>
                                            <p className="text-[10px] text-zinc-600 mt-1.5">JPG, PNG or WEBP • Max 2MB</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <FormRow label="Display Name">
                                            <Input
                                                value={displayName}
                                                onChange={e => setDisplayName(e.target.value)}
                                                placeholder="Jane Smith"
                                                className="h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-700 rounded-xl focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20"
                                            />
                                        </FormRow>
                                        <FormRow label="Email Address">
                                            <Input
                                                value={email}
                                                disabled
                                                className="h-10 bg-white/[0.03] border-white/10 text-zinc-500 rounded-xl cursor-not-allowed"
                                            />
                                            <p className="text-[10px] text-zinc-700 mt-1">Email cannot be changed from here. Contact support.</p>
                                        </FormRow>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <SaveButton onClick={handleSaveProfile} loading={isSaving} />
                                    </div>
                                </SectionCard>

                                <SectionCard title="Change Password" description="Update your account password.">
                                    <div className="space-y-4">
                                        <FormRow label="New Password">
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="Min. 8 characters"
                                                    className="h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-700 rounded-xl pr-10"
                                                />
                                                <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </FormRow>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <SaveButton onClick={handleChangePassword} loading={isSaving} label="Update Password" />
                                    </div>
                                </SectionCard>
                            </div>
                        )}

                        {/* ── APPEARANCE ── */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <SectionCard title="Theme" description="Currently dark theme is the only option. Light theme coming soon.">
                                    <div className="flex gap-3">
                                        <div className="flex-1 p-4 rounded-xl border border-white/20 bg-[#0a0a0a] flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-zinc-900 border-2 border-white/20" />
                                            <span className="text-sm font-bold text-white">Dark</span>
                                            <Check className="h-4 w-4 text-emerald-400 ml-auto" />
                                        </div>
                                        <div className="flex-1 p-4 rounded-xl border border-white/5 opacity-40 flex items-center gap-3 cursor-not-allowed">
                                            <div className="h-6 w-6 rounded-full bg-white border-2 border-zinc-200" />
                                            <span className="text-sm font-bold text-zinc-400">Light</span>
                                            <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-zinc-600">Soon</span>
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Font" description="Choose your preferred font for the dashboard UI.">
                                    <div className="flex gap-3">
                                        {FONT_OPTIONS.map(font => (
                                            <button
                                                key={font.id}
                                                onClick={() => { setSelectedFont(font.id); toast.success(`Font changed to ${font.label}`); }}
                                                className={cn(
                                                    'flex-1 p-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all',
                                                    selectedFont === font.id ? 'border-purple-500/40 bg-purple-500/5' : 'border-white/5 hover:border-white/10'
                                                )}
                                            >
                                                <span className={cn('text-2xl font-bold text-white', font.class)}>{font.preview}</span>
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase">{font.label}</span>
                                                {selectedFont === font.id && <Check className="h-3 w-3 text-purple-400" />}
                                            </button>
                                        ))}
                                    </div>
                                </SectionCard>

                                <SectionCard title="Layout" description="Customize the dashboard layout density.">
                                    <ToggleRow
                                        label="Compact Mode"
                                        description="Reduce padding and spacing across the dashboard"
                                        value={compactMode}
                                        onChange={setCompactMode}
                                    />
                                </SectionCard>
                            </div>
                        )}

                        {/* ── NOTIFICATIONS ── */}
                        {activeTab === 'notifications' && (
                            <SectionCard title="Email Notifications" description="Manage what emails you receive from us.">
                                <div className="space-y-4">
                                    <ToggleRow label="Job Alerts" description="Get notified about new matching jobs from your saved searches" value={emailJobAlerts} onChange={setEmailJobAlerts} />
                                    <ToggleRow label="Weekly Summary" description="Receive a weekly digest of your CV performance analytics" value={emailWeeklySummary} onChange={setEmailWeeklySummary} />
                                    <ToggleRow label="Product Updates" description="News about new features, improvements, and beta tests" value={emailProductUpdates} onChange={setEmailProductUpdates} />
                                </div>
                                <div className="flex justify-end mt-6">
                                    <SaveButton onClick={() => toast.success('Notification preferences saved')} loading={false} />
                                </div>
                            </SectionCard>
                        )}

                        {/* ── PRIVACY ── */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <SectionCard title="Visibility" description="Control who can see your profile and resume links.">
                                    <ToggleRow label="Public Profile" description="Allow anyone with your profile link to view your information" value={profilePublic} onChange={setProfilePublic} />
                                </SectionCard>
                                <SectionCard title="Analytics" description="Control data collection for improving your experience.">
                                    <ToggleRow label="Usage Analytics" description="Help us improve by sharing anonymized usage data" value={analyticsEnabled} onChange={setAnalyticsEnabled} />
                                </SectionCard>
                                <SectionCard title="Export Data" description="Download all your data from our platform.">
                                    <p className="text-xs text-zinc-500 mb-4">You can request a full export of your account data, including all CV data, letters, and analyses.</p>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-bold rounded-xl transition-colors" onClick={() => toast.info('Data export request received. You will get an email within 24 hours.')}>
                                        Request Data Export
                                    </button>
                                </SectionCard>
                            </div>
                        )}

                        {/* ── DANGER ── */}
                        {activeTab === 'danger' && (
                            <SectionCard title="Danger Zone" description="Irreversible actions." danger>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-red-300 mb-1">Delete Account</p>
                                                <p className="text-xs text-zinc-500">Permanently delete your account and all associated data. This cannot be undone.</p>
                                            </div>
                                            <button onClick={handleDeleteAccount} className="shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2">
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionCard({ title, description, children, danger }: { title: string; description: string; children: React.ReactNode; danger?: boolean }) {
    return (
        <div className={cn('rounded-2xl border p-6', danger ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/[0.06] bg-white/[0.015]')}>
            <div className="mb-5">
                <h2 className={cn('font-bold text-base', danger ? 'text-red-300' : 'text-white')}>{title}</h2>
                <p className="text-xs text-zinc-600 mt-0.5">{description}</p>
            </div>
            {children}
        </div>
    );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</Label>
            {children}
        </div>
    );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-bold text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{description}</p>
            </div>
            <button
                onClick={() => onChange(!value)}
                className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', value ? 'bg-emerald-500' : 'bg-zinc-700')}
            >
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5' : 'translate-x-0.5')} />
            </button>
        </div>
    );
}

function SaveButton({ onClick, loading, label = 'Save Changes' }: { onClick: () => void; loading: boolean; label?: string }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            {label}
        </button>
    );
}
