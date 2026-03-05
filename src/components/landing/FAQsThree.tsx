'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

export default function FAQsThree() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'clock',
            question: 'How does the LinkedIn import work and what do you pull from my profile?',
            answer: 'You paste your public LinkedIn profile URL, and we securely fetch the visible profile data (like your headline, experience, education, skills, and projects). Then we convert it into a clean, structured format so the AI can generate an ATS friendly resume. If a profile is private, restricted, or temporarily unavailable, the import may fail—then you can still create a resume manually.',
        },
        {
            id: 'item-2',
            icon: 'credit-card',
            question: 'Will my resume be ATS friendly and optimized for specific job descriptions?',
            answer: 'Yes. Every resume is generated in an ATS friendly structure (standard headings, simple formatting, keyword-ready content). You can also paste a job description (or a job URL if supported) and run an ATS match. We’ll give you: an ATS score (0–100), missing keywords, suggested improvements, and you can generate an optimized version tailored to that role.',
        },
        {
            id: 'item-3',
            icon: 'truck',
            question: 'How do the free trial and yearly subscription work?',
            answer: 'When you sign up, you start a free trial with full access to core features (resume generation, editing, PDF export, and sharing). After the trial ends, if you don’t upgrade, premium actions may be limited especially access to your public resume link. Upgrading activates the yearly plan and restores/keeps everything accessible.',
        },
        {
            id: 'item-4',
            icon: 'globe',
            question: 'Can I create multiple resume versions for different roles or companies?',
            answer: 'Absolutely. You can create unlimited versions of your resume for different job titles, companies, and job descriptions. Each version keeps its own ATS score and optimization history, so you can quickly switch and export the exact resume you want for each application.',
        },
        {
            id: 'item-5',
            icon: 'package',
            question: 'How do public resume links work—and what happens when the trial ends?',
            answer: 'You can generate a shareable public link (like yourapp.com/r/your-name-role) to send to recruiters or add to LinkedIn. During your trial (and with an active subscription), the link stays active and viewable. If your trial ends without upgrading, the link is automatically deactivated and visitors will see an upgrade page instead. Once you upgrade, the link is restored.',
        },
    ]

    return (
        <section className="bg-black py-20 relative z-10">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold text-white">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link
                                    href="/contact"
                                    className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-3">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-zinc-900/50 backdrop-blur-sm shadow-xs rounded-xl border border-white/5 px-4 transition-all hover:bg-zinc-900/80">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline text-white/90 hover:text-white transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-8 rounded-lg bg-primary/10 items-center justify-center text-primary">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="size-4"
                                                />
                                            </div>
                                            <span className="text-base font-medium">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5 pt-2">
                                        <div className="px-12">
                                            <p className="text-base text-zinc-400 leading-relaxed">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
