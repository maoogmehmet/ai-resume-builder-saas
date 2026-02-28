import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, GripVertical } from 'lucide-react'
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
            <Card className="relative mb-6 border-zinc-200 shadow-sm">
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-zinc-300 hover:text-zinc-900 transition-colors p-1"
                >
                    <GripVertical className="h-5 w-5" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 h-8 w-8"
                    onClick={() => onRemove(expIdx)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6 pl-12 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="flex justify-between">Job Title <span className="text-zinc-400 text-[10px] uppercase">{exp.title?.length || 0}/100</span></Label>
                            <Input maxLength={100} value={exp.title} onChange={(e) => onUpdate(expIdx, 'title', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex justify-between">Company <span className="text-zinc-400 text-[10px] uppercase">{exp.company?.length || 0}/100</span></Label>
                            <Input maxLength={100} value={exp.company} onChange={(e) => onUpdate(expIdx, 'company', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="flex justify-between">Location <span className="text-zinc-400 text-[10px] uppercase">{exp.location?.length || 0}/100</span></Label>
                            <Input maxLength={100} value={exp.location} onChange={(e) => onUpdate(expIdx, 'location', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input maxLength={20} placeholder="MM/YYYY" value={exp.start_date} onChange={(e) => onUpdate(expIdx, 'start_date', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input maxLength={20} placeholder="MM/YYYY or Present" value={exp.end_date} onChange={(e) => onUpdate(expIdx, 'end_date', e.target.value)} />
                            </div>
                        </div>

                        <div className="col-span-2 mt-4 space-y-3">
                            <Label className="text-sm font-semibold">Bullet Points</Label>
                            {exp.bullets.map((bullet: string, bIdx: number) => (
                                <div key={bIdx} className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={bullet}
                                            maxLength={300}
                                            onChange={(e) => onBulletUpdate(expIdx, bIdx, e.target.value)}
                                            className="min-h-[60px] text-sm"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => onRemoveBullet(expIdx, bIdx)} className="text-zinc-400 mt-2">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <span className="text-zinc-400 text-[9px] text-right font-medium tracking-widest">{bullet?.length || 0}/300</span>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => onAddBullet(expIdx)} className="w-full gap-2 border-dashed">
                                <Plus className="h-4 w-4" /> Add Bullet
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
        newExps[expIndex].bullets.push('')
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
        <div className="grid gap-2">
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

            <Button variant="secondary" onClick={handleAdd} className="w-full gap-2 py-6 border-zinc-200 bg-white hover:bg-zinc-50 border-2 border-dashed">
                <Plus className="h-4 w-4" /> Add Professional Experience
            </Button>
        </div>
    )
}
