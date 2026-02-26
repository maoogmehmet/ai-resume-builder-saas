import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface ExperienceProps {
    data: any[];
    onChange: (data: any[]) => void;
}

export function ExperienceSection({ data, onChange }: ExperienceProps) {
    const [experiences, setExperiences] = useState<any[]>(data || [])

    useEffect(() => {
        if (data) setExperiences(data)
    }, [data])

    const handleAdd = () => {
        const newExps = [...experiences, {
            title: '',
            company: '',
            location: '',
            start_date: '',
            end_date: '',
            bullets: ['']
        }]
        setExperiences(newExps)
        onChange(newExps)
    }

    const handleUpdate = (index: number, field: string, value: any) => {
        const newExps = [...experiences]
        newExps[index][field] = value
        setExperiences(newExps)
        onChange(newExps)
    }

    const handleBulletUpdate = (expIndex: number, bulletIndex: number, value: string) => {
        const newExps = [...experiences]
        newExps[expIndex].bullets[bulletIndex] = value
        setExperiences(newExps)
        onChange(newExps)
    }

    const addBullet = (expIndex: number) => {
        const newExps = [...experiences]
        newExps[expIndex].bullets.push('')
        setExperiences(newExps)
        onChange(newExps)
    }

    const removeBullet = (expIndex: number, bulletIndex: number) => {
        const newExps = [...experiences]
        newExps[expIndex].bullets.splice(bulletIndex, 1)
        setExperiences(newExps)
        onChange(newExps)
    }

    const removeExperience = (index: number) => {
        const newExps = [...experiences]
        newExps.splice(index, 1)
        setExperiences(newExps)
        onChange(newExps)
    }

    return (
        <div className="grid gap-6">
            {experiences.map((exp, expIdx) => (
                <Card key={expIdx} className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                        onClick={() => removeExperience(expIdx)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6 grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Job Title</Label>
                                <Input value={exp.title} onChange={(e) => handleUpdate(expIdx, 'title', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Company</Label>
                                <Input value={exp.company} onChange={(e) => handleUpdate(expIdx, 'company', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Input value={exp.location} onChange={(e) => handleUpdate(expIdx, 'location', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input placeholder="MM/YYYY" value={exp.start_date} onChange={(e) => handleUpdate(expIdx, 'start_date', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>End Date</Label>
                                    <Input placeholder="MM/YYYY or Present" value={exp.end_date} onChange={(e) => handleUpdate(expIdx, 'end_date', e.target.value)} />
                                </div>
                            </div>

                            <div className="col-span-2 mt-4 space-y-3">
                                <Label className="text-sm font-semibold">Bullet Points</Label>
                                {exp.bullets.map((bullet: string, bIdx: number) => (
                                    <div key={bIdx} className="flex gap-2">
                                        <Textarea
                                            value={bullet}
                                            onChange={(e) => handleBulletUpdate(expIdx, bIdx, e.target.value)}
                                            className="min-h-[60px]"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeBullet(expIdx, bIdx)} className="text-zinc-400">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addBullet(expIdx)} className="w-full gap-2">
                                    <Plus className="h-4 w-4" /> Add Bullet
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button variant="secondary" onClick={handleAdd} className="w-full gap-2">
                <Plus className="h-4 w-4" /> Add Experience
            </Button>
        </div>
    )
}
