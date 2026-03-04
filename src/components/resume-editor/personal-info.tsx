'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, User, X, Globe, Mail, Phone, MapPin, Linkedin, Image as ImageIcon, Camera } from 'lucide-react'
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
            toast.success('Profile photo updated!')
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
        { name: 'full_name', label: 'Full Name', icon: User, max: 50, placeholder: 'Jane Smith', half: true },
        { name: 'email', label: 'Email', icon: Mail, max: 100, placeholder: 'jane@example.com', half: true },
        { name: 'phone', label: 'Phone', icon: Phone, max: 20, placeholder: '+1 (555) 000-0000', half: true },
        { name: 'location', label: 'Location', icon: MapPin, max: 50, placeholder: 'San Francisco, CA', half: true },
        { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, max: 100, placeholder: 'linkedin.com/in/username', half: true },
        { name: 'portfolio', label: 'Website / Portfolio', icon: Globe, max: 100, placeholder: 'yourwebsite.com', half: true },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="relative h-20 w-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-xl group cursor-pointer" onClick={() => !imagePreview && fileInputRef.current?.click()}>
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            <button
                                onClick={(e) => { e.stopPropagation(); clearImage() }}
                                className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-20 border border-black"
                            >
                                <X className="h-2.5 w-2.5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <User className="h-8 w-8 text-zinc-700" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-5 w-5 text-white" />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-300 mb-1">Profile Photo</p>
                    <p className="text-[10px] text-zinc-600 mb-3">Optional — appears on some templates</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[10px] font-bold rounded-lg transition-colors"
                        >
                            <Upload className="h-3 w-3" /> Upload Photo
                        </button>
                        <span className="text-zinc-700 text-[9px] font-medium">JPG, PNG, WEBP • 2MB max</span>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
            </div>

            {/* Photo URL input (collapsed under "Use URL instead") */}
            <div>
                <Label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 block flex items-center gap-1.5">
                    <ImageIcon className="h-3 w-3" /> Or paste a photo URL
                </Label>
                <Input
                    name="profile_image"
                    value={imagePreview?.startsWith('data:') ? '' : (info.profile_image || '')}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="h-10 bg-white/[0.02] border-white/5 text-zinc-400 placeholder:text-zinc-800 text-sm focus:bg-white/[0.04] transition-all rounded-xl"
                />
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => {
                    const Icon = field.icon
                    return (
                        <div key={field.name} className="space-y-2">
                            <Label className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Icon className="h-3 w-3" /> {field.label}</span>
                                <span className="text-zinc-700">{(info[field.name] || '').length}/{field.max}</span>
                            </Label>
                            <Input
                                name={field.name}
                                value={info[field.name] || ''}
                                onChange={handleChange}
                                maxLength={field.max}
                                placeholder={field.placeholder}
                                className="h-11 bg-white/[0.02] border-white/5 text-zinc-200 placeholder:text-zinc-800 text-sm focus:bg-white/[0.04] transition-all rounded-xl"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
