import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, GripVertical, X } from 'lucide-react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ExperienceProps {
    data: any[];
    onChange: (data: any[]) => void;
}

function SortableExperienceItem({ exp, expIdx, onUpdate, onRemove, onAddBullet, onRemoveBullet, onBulletUpdate }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: exp.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="relative border border-white/[0.06] rounded-xl bg-white/[0.02] p-5 pl-10 mb-3 group">
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 cursor-grab text-zinc-700 hover:text-zinc-400 transition-colors p-1"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
                <button
                    className="absolute top-3 right-3 h-7 w-7 rounded-lg flex items-center justify-center text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => onRemove(expIdx)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Position</Label>
                        <Input
                            maxLength={100}
                            value={exp.position || ''}
                            onChange={(e) => onUpdate(expIdx, 'position', e.target.value)}
                            placeholder="Software Engineer"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Company</Label>
                        <Input
                            maxLength={100}
                            value={exp.company || ''}
                            onChange={(e) => onUpdate(expIdx, 'company', e.target.value)}
                            placeholder="Google"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Location</Label>
                        <Input
                            maxLength={50}
                            value={exp.location || ''}
                            onChange={(e) => onUpdate(expIdx, 'location', e.target.value)}
                            placeholder="San Francisco, CA"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Start Date</Label>
                            <Input
                                maxLength={20}
                                value={exp.start_date || ''}
                                onChange={(e) => onUpdate(expIdx, 'start_date', e.target.value)}
                                placeholder="MM/YYYY"
                                className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">End Date</Label>
                            <Input
                                maxLength={20}
                                value={exp.end_date || ''}
                                onChange={(e) => onUpdate(expIdx, 'end_date', e.target.value)}
                                placeholder="Present"
                                className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                            />
                        </div>
                    </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2 mt-3">
                    <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Key Achievements</Label>
                    {(exp.bullets || []).map((bullet: string, bIdx: number) => (
                        <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-emerald-500/60 mt-2 text-xs">•</span>
                            <Textarea
                                value={bullet}
                                onChange={(e) => onBulletUpdate(expIdx, bIdx, e.target.value)}
                                className="flex-1 min-h-[36px] h-9 py-2 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm resize-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                                placeholder="Led a team of..."
                            />
                            <button
                                onClick={() => onRemoveBullet(expIdx, bIdx)}
                                className="mt-1.5 h-6 w-6 rounded flex items-center justify-center text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onAddBullet(expIdx)}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        <Plus className="h-3 w-3" /> Add bullet point
                    </button>
                </div>
            </div>
        </div>
    )
}

export function ExperienceSection({ data, onChange }: ExperienceProps) {
    const [experiences, setExperiences] = useState<any[]>(() => {
        return (data || []).map((exp, i) => ({
            ...exp,
            id: exp.id || `exp-${i}-${Date.now()}`
        }))
    })

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExperiences(data.map((exp, i) => ({
                ...exp,
                id: exp.id || `exp-${i}-${Date.now()}`
            })))
        }
    }, [data])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAdd = () => {
        const newExps = [...experiences, {
            id: `exp-${Date.now()}`,
            position: '',
            company: '',
            location: '',
            start_date: '',
            end_date: '',
            bullets: ['']
        }]
        setExperiences(newExps)
        onChange(newExps)
    }

    const handleRemove = (index: number) => {
        const newExps = [...experiences]
        newExps.splice(index, 1)
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

    const handleAddBullet = (expIndex: number) => {
        const newExps = [...experiences]
        newExps[expIndex].bullets = [...(newExps[expIndex].bullets || []), '']
        setExperiences(newExps)
        onChange(newExps)
    }

    const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
        const newExps = [...experiences]
        newExps[expIndex].bullets.splice(bulletIndex, 1)
        setExperiences(newExps)
        onChange(newExps)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setExperiences((items) => {
                const oldIndex = items.findIndex(item => (item.id || items.indexOf(item)) === active.id);
                const newIndex = items.findIndex(item => (item.id || items.indexOf(item)) === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                onChange(newItems)
                return newItems;
            });
        }
    };

    return (
        <div className="space-y-3">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={experiences.map((exp) => exp.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {experiences.map((exp, expIdx) => (
                        <SortableExperienceItem
                            key={exp.id}
                            exp={exp}
                            expIdx={expIdx}
                            onUpdate={handleUpdate}
                            onRemove={handleRemove}
                            onAddBullet={handleAddBullet}
                            onRemoveBullet={handleRemoveBullet}
                            onBulletUpdate={handleBulletUpdate}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <button
                onClick={handleAdd}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/[0.06] text-zinc-600 hover:text-zinc-400 hover:border-white/[0.1] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
                <Plus className="h-4 w-4" /> Add Work Experience
            </button>
        </div>
    )
}
