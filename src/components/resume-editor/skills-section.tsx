import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { MultipleSelect, TTag } from '@/components/ui/multiple-select'

interface SkillsProps {
    data: { technical: string[], soft: string[] };
    onChange: (data: any) => void;
}

const COMMON_TECH_SKILLS = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'HTML', 'CSS',
    'Tailwind CSS', 'Framer Motion', 'GraphQL', 'REST API', 'Redis', 'Linux'
].map(s => ({ key: s.toLowerCase(), name: s }));

const COMMON_SOFT_SKILLS = [
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management',
    'Adaptability', 'Critical Thinking', 'Work Ethic', 'Attention to Detail',
    'Mentoring', 'Public Speaking', 'Agile', 'Scrum'
].map(s => ({ key: s.toLowerCase(), name: s }));

export function SkillsSection({ data, onChange }: SkillsProps) {
    const [skills, setSkills] = useState({ technical: data?.technical || [], soft: data?.soft || [] })

    // Convert arrays of strings to TTag arrays for the MultipleSelect component
    const techTags = skills.technical.map(s => ({ key: s.toLowerCase(), name: s }));
    const softTags = skills.soft.map(s => ({ key: s.toLowerCase(), name: s }));

    // Input state for custom skills not in the common list
    const [techInput, setTechInput] = useState('');
    const [softInput, setSoftInput] = useState('');

    useEffect(() => {
        if (data) setSkills({ technical: data.technical || [], soft: data.soft || [] })
    }, [data])

    const handleTechChange = (newTags: TTag[]) => {
        const newTechArray = newTags.map(t => t.name);
        if (JSON.stringify(newTechArray) !== JSON.stringify(skills.technical)) {
            const newSkills = { ...skills, technical: newTechArray };
            setSkills(newSkills);
            onChange(newSkills);
        }
    }

    const handleSoftChange = (newTags: TTag[]) => {
        const newSoftArray = newTags.map(t => t.name);
        if (JSON.stringify(newSoftArray) !== JSON.stringify(skills.soft)) {
            const newSkills = { ...skills, soft: newSoftArray };
            setSkills(newSkills);
            onChange(newSkills);
        }
    }

    const addCustomTech = () => {
        if (!techInput.trim()) return;
        const newTechArray = [...skills.technical, techInput.trim()];
        const newSkills = { ...skills, technical: newTechArray };
        setSkills(newSkills);
        onChange(newSkills);
        setTechInput('');
    }

    const addCustomSoft = () => {
        if (!softInput.trim()) return;
        const newSoftArray = [...skills.soft, softInput.trim()];
        const newSkills = { ...skills, soft: newSoftArray };
        setSkills(newSkills);
        onChange(newSkills);
        setSoftInput('');
    }

    // Prepare tags for MultipleSelect: combine common skills + selected skills 
    // to ensure selected ones always appear in the list, plus filter by input
    const availableTechTags = [...COMMON_TECH_SKILLS, ...techTags]
        .filter((tag, index, self) => index === self.findIndex((t) => t.key === tag.key))
        .filter(tag => tag.name.toLowerCase().includes(techInput.toLowerCase()));

    const availableSoftTags = [...COMMON_SOFT_SKILLS, ...softTags]
        .filter((tag, index, self) => index === self.findIndex((t) => t.key === tag.key))
        .filter(tag => tag.name.toLowerCase().includes(softInput.toLowerCase()));

    return (
        <Card>
            <CardContent className="pt-6 grid gap-8">
                <div className="grid gap-4">
                    <Label className="text-base font-semibold">Technical Skills</Label>
                    <p className="text-sm text-zinc-500">Select standard skills or type a custom one to add.</p>

                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="Type to search or add custom technical skill..."
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomTech()}
                        />
                        <Button type="button" onClick={addCustomTech} variant="secondary"><Plus className="h-4 w-4" /></Button>
                    </div>

                    <div className="w-full relative overflow-hidden bg-white rounded-xl shadow-sm border border-zinc-200/60 p-2">
                        <MultipleSelect
                            tags={availableTechTags}
                            defaultValue={techTags}
                            onChange={handleTechChange}
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    <Label className="text-base font-semibold">Soft Skills</Label>
                    <p className="text-sm text-zinc-500">Select standard skills or type a custom one to add.</p>

                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="Type to search or add custom soft skill..."
                            value={softInput}
                            onChange={(e) => setSoftInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomSoft()}
                        />
                        <Button type="button" onClick={addCustomSoft} variant="secondary"><Plus className="h-4 w-4" /></Button>
                    </div>

                    <div className="w-full relative overflow-hidden bg-white rounded-xl shadow-sm border border-zinc-200/60 p-2">
                        <MultipleSelect
                            tags={availableSoftTags}
                            defaultValue={softTags}
                            onChange={handleSoftChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
