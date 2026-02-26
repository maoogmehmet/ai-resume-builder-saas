import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SkillsProps {
    data: { technical: string[], soft: string[] };
    onChange: (data: any) => void;
}

export function SkillsSection({ data, onChange }: SkillsProps) {
    const [skills, setSkills] = useState(data || { technical: [], soft: [] })
    const [newTechSkill, setNewTechSkill] = useState('')
    const [newSoftSkill, setNewSoftSkill] = useState('')

    useEffect(() => {
        if (data) setSkills(data)
    }, [data])

    const addSkill = (type: 'technical' | 'soft', value: string) => {
        if (!value.trim()) return;
        const newSkills = { ...skills, [type]: [...skills[type], value.trim()] }
        setSkills(newSkills)
        onChange(newSkills)
        if (type === 'technical') setNewTechSkill('')
        else setNewSoftSkill('')
    }

    const removeSkill = (type: 'technical' | 'soft', index: number) => {
        const newSkills = { ...skills }
        newSkills[type].splice(index, 1)
        setSkills(newSkills)
        onChange(newSkills)
    }

    return (
        <Card>
            <CardContent className="pt-6 grid gap-8">
                <div className="grid gap-4">
                    <Label className="text-base font-semibold">Technical Skills</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. React, Python, AWS..."
                            value={newTechSkill}
                            onChange={(e) => setNewTechSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill('technical', newTechSkill)}
                        />
                        <Button type="button" onClick={() => addSkill('technical', newTechSkill)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.technical.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="px-3 py-1 flex items-center gap-1 group">
                                {skill}
                                <Trash2
                                    className="h-3 w-3 cursor-pointer text-zinc-400 group-hover:text-red-500 ml-1"
                                    onClick={() => removeSkill('technical', idx)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    <Label className="text-base font-semibold">Soft Skills</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Leadership, Communication..."
                            value={newSoftSkill}
                            onChange={(e) => setNewSoftSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill('soft', newSoftSkill)}
                        />
                        <Button type="button" onClick={() => addSkill('soft', newSoftSkill)}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.soft.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="px-3 py-1 flex items-center gap-1 group">
                                {skill}
                                <Trash2
                                    className="h-3 w-3 cursor-pointer text-zinc-400 group-hover:text-red-500 ml-1"
                                    onClick={() => removeSkill('soft', idx)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
