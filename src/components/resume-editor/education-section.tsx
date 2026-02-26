import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    } = useSortable({ id: edu.id || idx });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="relative mb-6 border-zinc-200">
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
                    onClick={() => onRemove(idx)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6 pl-12 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>School / University</Label>
                            <Input value={edu.school} onChange={(e) => onUpdate(idx, 'school', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Degree</Label>
                            <Input value={edu.degree} onChange={(e) => onUpdate(idx, 'degree', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Graduation Date</Label>
                            <Input placeholder="MM/YYYY" value={edu.graduation_date} onChange={(e) => onUpdate(idx, 'graduation_date', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>GPA (optional)</Label>
                            <Input value={edu.gpa} onChange={(e) => onUpdate(idx, 'gpa', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function EducationSection({ data, onChange }: EducationProps) {
    const [educations, setEducations] = useState<any[]>(data || [])

    useEffect(() => {
        if (data) setEducations(data)
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
        <div className="grid gap-2">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={educations.map((edu, i) => edu.id || i)}
                    strategy={verticalListSortingStrategy}
                >
                    {educations.map((edu, idx) => (
                        <SortableEducationItem
                            key={edu.id || idx}
                            edu={edu}
                            idx={idx}
                            onUpdate={handleUpdate}
                            onRemove={handleRemove}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button variant="secondary" onClick={handleAdd} className="w-full gap-2 py-6 bg-white hover:bg-zinc-50 border-2 border-dashed border-zinc-200">
                <Plus className="h-4 w-4" /> Add Academic History
            </Button>
        </div>
    )
}
