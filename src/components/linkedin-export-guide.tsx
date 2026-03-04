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
import { Linkedin, FileText, ArrowRight, Share2, MousePointerClick } from 'lucide-react';

export function LinkedinExportGuide({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider p-2 rounded-md hover:bg-white/5">
                        <Share2 className="w-4 h-4" />
                        <span>Add to LinkedIn</span>
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-white/10 bg-[#0a0a0a] text-white p-6 shadow-2xl rounded-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-[#0A66C2]/10 rounded-xl">
                            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        </div>
                        Upload to LinkedIn
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        LinkedIn API prevents automatic CV uploads. Follow these steps to attach your new high-performance CV to your profile.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-300">1</div>
                        <div>
                            <h4 className="font-bold text-zinc-200 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Download PDF</h4>
                            <p className="text-xs text-zinc-500 mt-1">Download your optimized resume in PDF format to your device.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-300">2</div>
                        <div>
                            <h4 className="font-bold text-zinc-200 flex items-center gap-2"><Linkedin className="w-4 h-4 text-[#0A66C2]" /> Open LinkedIn Profile</h4>
                            <p className="text-xs text-zinc-500 mt-1">Go to your LinkedIn profile page and scroll down to the <strong>Featured</strong> (Öne Çıkanlar) section.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-300">3</div>
                        <div>
                            <h4 className="font-bold text-zinc-200 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-emerald-500" /> Add Media</h4>
                            <p className="text-xs text-zinc-500 mt-1">Click the <kbd className="bg-zinc-800 px-1 rounded text-zinc-300">+</kbd> icon, select <strong>Add media</strong>, and choose your downloaded PDF file.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open('https://www.linkedin.com/in/', '_blank')}
                        className="w-full bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all group"
                    >
                        Go to LinkedIn <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
