import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="space-y-6">
            {/* Technical Skills */}
            <div className="space-y-3">
                <div>
                    <Label className="text-sm font-semibold text-zinc-300">Technical Skills</Label>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Select standard skills or type a custom one to add.</p>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Type to search or add custom skill..."
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomTech()}
                        className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                    />
                    <button
                        onClick={addCustomTech}
                        className="h-8 w-8 shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="w-full relative overflow-hidden bg-white/[0.02] rounded-xl border border-white/[0.06] p-2">
                    <MultipleSelect
                        tags={availableTechTags}
                        defaultValue={techTags}
                        onChange={handleTechChange}
                    />
                </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-3">
                <div>
                    <Label className="text-sm font-semibold text-zinc-300">Soft Skills</Label>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Select standard skills or type a custom one to add.</p>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Type to search or add custom skill..."
                        value={softInput}
                        onChange={(e) => setSoftInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomSoft()}
                        className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                    />
                    <button
                        onClick={addCustomSoft}
                        className="h-8 w-8 shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-500 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="w-full relative overflow-hidden bg-white/[0.02] rounded-xl border border-white/[0.06] p-2">
                    <MultipleSelect
                        tags={availableSoftTags}
                        defaultValue={softTags}
                        onChange={handleSoftChange}
                    />
                </div>
            </div>
        </div>
    )
}
