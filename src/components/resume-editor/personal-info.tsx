'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, User, X, Globe, Mail, Phone, MapPin, Linkedin } from 'lucide-react'
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

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Only JPG / PNG accepted')
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string
            setImagePreview(base64)
            const newInfo = { ...info, profile_image: base64 }
            setInfo(newInfo)
            onChange(newInfo)
            toast.success('Photo uploaded!')
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
        { name: 'full_name', label: 'Full Name', icon: User, max: 50, placeholder: 'John Doe', half: true },
        { name: 'email', label: 'Email', icon: Mail, max: 100, placeholder: 'john@example.com', half: true },
        { name: 'phone', label: 'Phone', icon: Phone, max: 20, placeholder: '+1 (555) 000-0000', half: true },
        { name: 'location', label: 'Location', icon: MapPin, max: 50, placeholder: 'San Francisco, CA', half: true },
        { name: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, max: 100, placeholder: 'linkedin.com/in/johndoe', half: true },
        { name: 'portfolio', label: 'Portfolio / Website', icon: Globe, max: 100, placeholder: 'johndoe.com', half: true },
    ]

    return (
        <div className="space-y-5">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            <button onClick={clearImage} className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10">
                                <X className="h-3 w-3 text-white" />
                            </button>
                        </>
                    ) : (
                        <User className="h-7 w-7 text-zinc-600" />
                    )}
                </div>
                <div>
                    <p className="text-[13px] text-zinc-400 font-medium mb-1.5">Profile Photo <span className="text-zinc-600 text-[11px]">(JPG, PNG — max 2MB)</span></p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 px-3 text-xs font-semibold rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
                    >
                        <Upload className="h-3 w-3" /> Upload Photo
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFileUpload} />
                </div>
            </div>

            {/* OR Paste URL */}
            <div>
                <Label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">Or Paste Image URL</Label>
                <Input
                    name="profile_image"
                    value={info.profile_image || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="h-9 bg-white/[0.03] border-white/[0.08] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                />
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-3">
                {fields.map((field) => {
                    const Icon = field.icon
                    return (
                        <div key={field.name} className="space-y-1.5">
                            <Label className="flex justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Icon className="h-3 w-3" /> {field.label}</span>
                                <span className="text-zinc-700 text-[10px]">{(info[field.name] || '').length}/{field.max}</span>
                            </Label>
                            <Input
                                name={field.name}
                                value={info[field.name] || ''}
                                onChange={handleChange}
                                maxLength={field.max}
                                placeholder={field.placeholder}
                                className="h-9 bg-white/[0.03] border-white/[0.08] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
