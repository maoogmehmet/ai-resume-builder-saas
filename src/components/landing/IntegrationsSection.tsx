import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                            Connect with the career ecosystem
                        </h2>
                        <p className="text-muted-foreground mt-6">
                            Novatypalcv integrates with major job platforms and tracking systems to streamline your application process.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <IntegrationCard
                            title="LinkedIn"
                            description="One-click professional history sync and direct sharing with recruiters.">
                            <LinkedInLogo />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Indeed"
                            description="Automatically tailor your resume for top-tier listings on the world's largest job site.">
                            <IndeedLogo />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Glassdoor"
                            description="Research company culture while optimizing your resume for specific organizational values.">
                            <GlassdoorLogo />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Greenhouse"
                            description="Ensure 100% ATS compatibility for companies using modern hiring workflows.">
                            <GreenhouseLogo />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Lever"
                            description="Optimize your application structure for seamless processing in Lever's ATS ecosystem.">
                            <LeverLogo />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Google Jobs"
                            description="Boost your visibility on Google Search results with structured, SEO-friendly resumes.">
                            <GoogleJobsLogo />
                        </IntegrationCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({
    title,
    description,
    children,
    link = 'https://github.com/meschacirung/cnblocks',
}: {
    title: string
    description: string
    children: React.ReactNode
    link?: string
}) => {
    return (
        <Card className="p-6">
            <div className="relative">
                <div className="*:size-10">{children}</div>

                <div className="space-y-2 py-6">
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                </div>

                <div className="flex gap-3 border-t border-dashed pt-6">
                    <Button asChild variant="secondary" size="sm" className="gap-1 pr-2 shadow-none">
                        <Link href={link}>
                            Learn More
                            <ChevronRight className="ml-0 !size-3.5 opacity-50" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}

// --- Logos (inline SVG) ---
const LinkedInLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

const IndeedLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-700">
        <path d="M2.397 4.574c-.707 0-1.28.572-1.28 1.28v12.292c0 .708.573 1.28 1.28 1.28h19.206c.707 0 1.28-.572 1.28-1.28v-12.292c0-.708-.573-1.28-1.28-1.28h-19.206zM12 15h-3v-3h3v3zm0-4h-3v-3h3v3z" />
    </svg>
)

const GlassdoorLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z" />
    </svg>
)

const GreenhouseLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 15V9h4v8h-4z" />
    </svg>
)

const LeverLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300">
        <path d="M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
    </svg>
)

const GoogleJobsLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
)
