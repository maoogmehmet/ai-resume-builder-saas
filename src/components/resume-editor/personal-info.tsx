'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { Upload, User, X, Globe, Mail, Phone, MapPin, Linkedin, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface PersonalInfoProps {
    data: any;
    onChange: (data: any) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoProps) {
    const [info, setInfo] = useState(data || {
        full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', profile_image: ''
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(data?.profile_image || null)

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInfo(data)
            if (data.profile_image) setImagePreview(data.profile_image)
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInfo = { ...info, [e.target.name]: e.target.value }
        setInfo(newInfo)
        onChange(newInfo)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2MB')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Only JPG, PNG or WEBP accepted')
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string
            setImagePreview(base64)
            const newInfo = { ...info, profile_image: base64 }
            setInfo(newInfo)
            onChange(newInfo)
            toast.success('Identity visual updated!')
        }
        reader.readAsDataURL(file)
    }

    const clearImage = () => {
        setImagePreview(null)
        const newInfo = { ...info, profile_image: '' }
        setInfo(newInfo)
        onChange(newInfo)
    }

    const fields = [
        { name: 'full_name', label: 'Full Name', icon: User, max: 50, placeholder: 'Elite Candidate', half: true },
        { name: 'email', label: 'Identity Email', icon: Mail, max: 100, placeholder: 'identity@domain.com', half: true },
        { name: 'phone', label: 'Secure Line', icon: Phone, max: 20, placeholder: '+1 000 000 0000', half: true },
        { name: 'location', label: 'HQ Location', icon: MapPin, max: 50, placeholder: 'Silicon Valley, CA', half: true },
        { name: 'linkedin', label: 'LinkedIn Node', icon: Linkedin, max: 100, placeholder: 'linkedin.com/in/node', half: true },
        { name: 'portfolio', label: 'Project Hub', icon: Globe, max: 100, placeholder: 'domain.com', half: true },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Profile Photo */}
            <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                <div className="relative h-20 w-20 rounded-[1.5rem] bg-black border-2 border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <button onClick={clearImage} className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-20 border-2 border-black">
                                <X className="h-3 w-3" />
                            </button>
                        </>
                    ) : (
                        <User className="h-8 w-8 text-zinc-800" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-3 italic">Visual Identity Node</p>
                    <div className="flex items-center gap-3">
                        <AnimatedGenerateButton
                            onClick={() => fileInputRef.current?.click()}
                            labelIdle="upload visual"
                            size="sm"
                            className="font-black italic"
                            icon={<Upload className="h-3.5 w-3.5" />}
                        />
                        <span className="text-zinc-800 text-[9px] font-black uppercase tracking-widest italic opacity-40">JPG, PNG, WEBP — 2MB MAX</span>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
            </div>

            {/* OR Paste URL */}
            <div className="px-2">
                <Label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-3 block italic ml-1">Remote Asset URL</Label>
                <div className="relative group">
                    <Input
                        name="profile_image"
                        value={info.profile_image || ''}
                        onChange={handleChange}
                        placeholder="https://cloud.assets.com/identity.jpg"
                        className="h-12 bg-white/[0.02] border-white/5 text-zinc-300 placeholder:text-zinc-800 text-sm font-black italic focus:bg-white/[0.04] transition-all rounded-xl pl-11"
                    />
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-5 px-2">
                {fields.map((field) => {
                    const Icon = field.icon
                    return (
                        <div key={field.name} className="space-y-3">
                            <Label className="flex justify-between text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] italic ml-1">
                                <span className="flex items-center gap-2"><Icon className="h-3 w-3" /> {field.label}</span>
                                <span className="opacity-40">{(info[field.name] || '').length}/{field.max}</span>
                            </Label>
                            <Input
                                name={field.name}
                                value={info[field.name] || ''}
                                onChange={handleChange}
                                maxLength={field.max}
                                placeholder={field.placeholder}
                                className="h-12 bg-white/[0.02] border-white/5 text-zinc-300 placeholder:text-zinc-800 text-sm font-black italic focus:bg-white/[0.04] transition-all rounded-xl"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
