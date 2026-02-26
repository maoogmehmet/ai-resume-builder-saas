import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface EducationProps {
    data: any[];
    onChange: (data: any[]) => void;
}

export function EducationSection({ data, onChange }: EducationProps) {
    const [educations, setEducations] = useState<any[]>(data || [])

    useEffect(() => {
        if (data) setEducations(data)
    }, [data])

    const handleAdd = () => {
        const newEdus = [...educations, {
            degree: '',
            school: '',
            graduation_date: '',
            gpa: ''
        }]
        setEducations(newEdus)
        onChange(newEdus)
    }

    const handleUpdate = (index: number, field: string, value: any) => {
        const newEdus = [...educations]
        newEdus[index][field] = value
        setEducations(newEdus)
        onChange(newEdus)
    }

    const removeEducation = (index: number) => {
        const newEdus = [...educations]
        newEdus.splice(index, 1)
        setEducations(newEdus)
        onChange(newEdus)
    }

    return (
        <div className="grid gap-6">
            {educations.map((edu, idx) => (
                <Card key={idx} className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                        onClick={() => removeEducation(idx)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6 grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>School / University</Label>
                                <Input value={edu.school} onChange={(e) => handleUpdate(idx, 'school', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Degree</Label>
                                <Input value={edu.degree} onChange={(e) => handleUpdate(idx, 'degree', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Graduation Date</Label>
                                <Input placeholder="MM/YYYY" value={edu.graduation_date} onChange={(e) => handleUpdate(idx, 'graduation_date', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>GPA (optional)</Label>
                                <Input value={edu.gpa} onChange={(e) => handleUpdate(idx, 'gpa', e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button variant="secondary" onClick={handleAdd} className="w-full gap-2">
                <Plus className="h-4 w-4" /> Add Education
            </Button>
        </div>
    )
}
