'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FeedbackModal({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error('Message cannot be empty.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, message })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit feedback');
            }

            toast.success('Geri bildirim gönderildi!', {
                description: 'Geliştirmemize yardımcı olduğunuz için teşekkürler.',
            });

            setOpen(false);
            setMessage('');
            setType('general');

        } catch (error: any) {
            toast.error('Geri bildirim gönderilirken hata oluştu', {
                description: error.message || 'Bir şeyler yanlış gitti.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium p-2 rounded-md hover:bg-white/5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Geri Bildirim Gönder</span>
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-white/10 bg-[#0a0a0a] text-white p-6 shadow-2xl rounded-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                        </div>
                        Geliştirmemize Yardımcı Olun
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Bir hata mı fark ettiniz veya bir öneriniz mi var? Sizden duymak isteriz.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex bg-black/50 p-1.5 rounded-lg border border-white/5 gap-1">
                        {(['general', 'bug', 'feature'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${type === t
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                    }`}
                            >
                                {t === 'bug' ? 'Hata Bildirimi' : t === 'feature' ? 'Özellik İsteği' : 'Genel'}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Lütfen belirli detayları sağlayın..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="bg-black/50 border-white/10 focus-visible:ring-blue-500 text-white placeholder:text-zinc-600 rounded-xl resize-none p-4"
                            disabled={isSubmitting}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || !message.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                        {isSubmitting ? 'Gönderiliyor...' : (
                            <span className="flex items-center gap-2">
                                Geri Bildirim Gönder <Send className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
