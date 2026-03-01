import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface EducationProps {
    data: any[];
    onChange: (data: any[]) => void;
}

function SortableEducationItem({ edu, idx, onUpdate, onRemove }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: edu.id });

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
                    onClick={() => onRemove(idx)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">School / University</Label>
                        <Input
                            maxLength={100}
                            value={edu.school}
                            onChange={(e) => onUpdate(idx, 'school', e.target.value)}
                            placeholder="Stanford University"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Degree</Label>
                        <Input
                            maxLength={100}
                            value={edu.degree}
                            onChange={(e) => onUpdate(idx, 'degree', e.target.value)}
                            placeholder="B.S. Computer Science"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Graduation Date</Label>
                        <Input
                            maxLength={20}
                            placeholder="MM/YYYY"
                            value={edu.graduation_date}
                            onChange={(e) => onUpdate(idx, 'graduation_date', e.target.value)}
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">GPA (optional)</Label>
                        <Input
                            maxLength={10}
                            value={edu.gpa}
                            onChange={(e) => onUpdate(idx, 'gpa', e.target.value)}
                            placeholder="3.8 / 4.0"
                            className="h-8 bg-white/[0.03] border-white/[0.06] text-zinc-300 placeholder:text-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function EducationSection({ data, onChange }: EducationProps) {
    const [educations, setEducations] = useState<any[]>(() => {
        return (data || []).map((edu, i) => ({
            ...edu,
            id: edu.id || `edu-${i}-${Date.now()}`
        }))
    })

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEducations(data.map((edu, i) => ({
                ...edu,
                id: edu.id || `edu-${i}-${Date.now()}`
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
        const newEdus = [...educations, {
            id: `edu-${Date.now()}`,
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

    const handleRemove = (index: number) => {
        const newEdus = [...educations]
        newEdus.splice(index, 1)
        setEducations(newEdus)
        onChange(newEdus)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setEducations((items) => {
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
                    items={educations.map((edu) => edu.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {educations.map((edu, idx) => (
                        <SortableEducationItem
                            key={edu.id}
                            edu={edu}
                            idx={idx}
                            onUpdate={handleUpdate}
                            onRemove={handleRemove}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <button
                onClick={handleAdd}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/[0.06] text-zinc-600 hover:text-zinc-400 hover:border-white/[0.1] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
                <Plus className="h-4 w-4" /> Add Education
            </button>
        </div>
    )
}
