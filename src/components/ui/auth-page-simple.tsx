'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, CheckCircle2 } from 'lucide-react'
import { Logo } from './logo'
import { Input } from './input'
import { Label } from './label'
import AnimatedGenerateButton from './animated-generate-button'

interface Field {
    id: string
    name: string
    type: string
    label: string
    placeholder?: string
    autoComplete?: string
}

interface AuthPageSimpleProps {
    title: string
    subtitle: string
    action: (formData: FormData) => Promise<any> | void
    submitLabel: string
    fields: Field[]
    error?: string
    message?: string
    backHref?: string
    backLabel?: string
}

export function AuthPageSimple({
    title, subtitle, action, submitLabel, fields, error, message, backHref = '/auth/signin', backLabel = 'Back'
}: AuthPageSimpleProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)]" />
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="flex items-center justify-center">
                        <Logo className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-white">Novatypalcv</span>
                </div>

                {/* Title */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{title}</h1>
                    <p className="text-zinc-500 font-medium">{subtitle}</p>
                </div>

                {/* Success message */}
                {message ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4 mb-8">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-emerald-400 font-bold text-sm">{message}</p>
                            <p className="text-zinc-500 text-xs mt-1">Didn't receive it? Check your spam folder.</p>
                        </div>
                    </div>
                ) : (
                    <form
                        action={async (formData: FormData) => {
                            setIsSubmitting(true)
                            await action(formData)
                            setIsSubmitting(false)
                        }}
                        className="space-y-6"
                        autoComplete="off"
                    >
                        {fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id} className="text-white font-bold ml-1">{field.label}</Label>
                                <Input
                                    id={field.id}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autoComplete}
                                    defaultValue=""
                                    required
                                    className="h-14 rounded-2xl bg-white border-none text-black font-medium placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
                                />
                            </div>
                        ))}

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <AnimatedGenerateButton
                            type="submit"
                            disabled={isSubmitting}
                            generating={isSubmitting}
                            labelIdle={submitLabel}
                            labelActive="Sending..."
                            size="lg"
                            className="w-full h-14"
                        />
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link href={backHref} className="flex items-center justify-center gap-2 text-zinc-600 text-sm font-bold hover:text-white transition-colors">
                        <ChevronLeftIcon className="h-4 w-4" /> {backLabel}
                    </Link>
                </div>
            </div>
        </main>
    )
}
