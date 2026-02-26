import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
        portfolio: ''
    })

    // Watch for incoming data changes (like AI generation completion)
    useEffect(() => {
        if (data) setInfo(data)
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newInfo = { ...info, [e.target.name]: e.target.value }
        setInfo(newInfo)
        onChange(newInfo)
    }

    return (
        <Card>
            <CardContent className="pt-6 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>Full Name</Label>
                        <Input name="full_name" value={info.full_name} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>Email</Label>
                        <Input name="email" value={info.email} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>Phone</Label>
                        <Input name="phone" value={info.phone} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>Location</Label>
                        <Input name="location" value={info.location} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>LinkedIn</Label>
                        <Input name="linkedin" value={info.linkedin} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2 col-span-2 sm:col-span-1">
                        <Label>Portfolio / Website</Label>
                        <Input name="portfolio" value={info.portfolio} onChange={handleChange} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
