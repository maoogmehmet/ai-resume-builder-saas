'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, User, X } from 'lucide-react'
import { toast } from 'sonner'

interface PersonalInfoProps {
    data: any;
    onChange: (data: any) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoProps) {
    const [info, setInfo] = useState(data || {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        profile_image: ''
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (data) setInfo(data)
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
            toast.error('Image too large', { description: 'Please choose an image under 2MB' })
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type', { description: 'Please upload an image file' })
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            const base64 = ev.target?.result as string
            const newInfo = { ...info, profile_image: base64 }
            setInfo(newInfo)
            onChange(newInfo)
            toast.success('Photo uploaded!', { description: 'Your profile photo will appear in the PDF' })
        }
        reader.readAsDataURL(file)
    }

    const clearImage = () => {
        const newInfo = { ...info, profile_image: '' }
        setInfo(newInfo)
        onChange(newInfo)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-0 grid gap-5">

                {/* Profile Image Upload */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="relative shrink-0">
                        {info.profile_image ? (
                            <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-sm relative group">
                                <img src={info.profile_image} alt="Profile" className="h-full w-full object-cover" />
                                <button
                                    onClick={clearImage}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        ) : (
                            <div className="h-20 w-20 rounded-2xl bg-zinc-200 flex items-center justify-center border-2 border-dashed border-zinc-300">
                                <User className="h-8 w-8 text-zinc-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-zinc-900 mb-1">Profile Photo</p>
                        <p className="text-xs text-zinc-400 mb-3">Upload a professional headshot (JPG, PNG — max 2MB). It will appear in your PDF.</p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold gap-1.5 border-zinc-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Upload Photo
                            </Button>
                            {info.profile_image && (
                                <Button type="button" variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50" onClick={clearImage}>
                                    Remove
                                </Button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {/* Or paste URL */}
                <div className="grid gap-1.5">
                    <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Or paste image URL</Label>
                    <Input
                        name="profile_image"
                        maxLength={500}
                        value={info.profile_image?.startsWith('data:') ? '' : (info.profile_image || '')}
                        onChange={handleChange}
                        placeholder="https://example.com/your-photo.jpg"
                        className="h-10 text-sm"
                        disabled={info.profile_image?.startsWith('data:')}
                    />
                    {info.profile_image?.startsWith('data:') && (
                        <p className="text-[10px] text-zinc-400">Clear the uploaded file to use a URL instead</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            Full Name <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.full_name?.length || 0}/50</span>
                        </Label>
                        <Input
                            name="full_name"
                            maxLength={50}
                            className={`h-10 ${!info.full_name ? 'border-red-200 focus-visible:ring-red-500' : ''}`}
                            value={info.full_name || ''}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            Email <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.email?.length || 0}/100</span>
                        </Label>
                        <Input
                            name="email"
                            type="email"
                            maxLength={100}
                            className={`h-10 ${!info.email ? 'border-red-200 focus-visible:ring-red-500' : ''}`}
                            value={info.email || ''}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            Phone <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.phone?.length || 0}/20</span>
                        </Label>
                        <Input name="phone" maxLength={20} className="h-10" value={info.phone || ''} onChange={handleChange} placeholder="+1 234 567 890" />
                    </div>
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            Location <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.location?.length || 0}/50</span>
                        </Label>
                        <Input name="location" maxLength={50} className="h-10" value={info.location || ''} onChange={handleChange} placeholder="New York, NY" />
                    </div>
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            LinkedIn URL <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.linkedin?.length || 0}/100</span>
                        </Label>
                        <Input name="linkedin" maxLength={100} className="h-10" value={info.linkedin || ''} onChange={handleChange} placeholder="linkedin.com/in/johndoe" />
                    </div>
                    <div className="grid gap-1.5 col-span-2 sm:col-span-1">
                        <Label className="flex justify-between">
                            Portfolio / Website <span className="text-zinc-400 text-[10px] font-medium tracking-widest">{info.portfolio?.length || 0}/100</span>
                        </Label>
                        <Input name="portfolio" maxLength={100} className="h-10" value={info.portfolio || ''} onChange={handleChange} placeholder="johndoe.com" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
