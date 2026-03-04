import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold hover:text-white transition-colors mb-12">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Terms of Service</h1>
                        <p className="text-zinc-500 text-sm">Last updated: March 1, 2026</p>
                    </div>
                </div>
                <div className="space-y-10">
                    {[
                        { title: '1. Acceptance of Terms', body: 'By accessing or using Novatypalcv ("Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.' },
                        { title: '2. Description of Service', body: 'Novatypalcv provides an AI-powered resume building and career optimization platform including AI resume generation, ATS optimization, cover letter creation, and career analytics. The Service may be updated at any time.' },
                        { title: '3. User Accounts', body: 'You must create an account to access features. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. You agree to provide accurate and complete information during registration.' },
                        { title: '4. Subscription and Payments', body: 'Certain features require a paid subscription. By subscribing, you authorize recurring charges. Subscriptions renew automatically unless cancelled. Refunds are available within 14 days of initial purchase if unsatisfied.' },
                        { title: '5. Acceptable Use', body: 'You agree not to use the Service to create misleading or fraudulent content, violate applicable laws, infringe on third-party intellectual property, or attempt to reverse engineer our AI systems. We may terminate accounts that violate these terms.' },
                        { title: '6. Intellectual Property', body: 'Content you create belongs to you. Novatypalcv retains ownership of the platform, AI models, and underlying technology. You grant us a limited license to process your content solely for providing the Service.' },
                        { title: '7. Limitation of Liability', body: 'To the maximum extent permitted by law, Novatypalcv shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service.' },
                        { title: '8. Changes to Terms', body: 'We may modify these Terms at any time. Users will be notified of material changes via email or the Service. Continued use after changes constitutes acceptance of the updated Terms.' },
                        { title: '9. Contact', body: 'For questions about these Terms, contact us at legal@novatypalcv.com.' },
                    ].map((s) => (
                        <section key={s.title}>
                            <h2 className="text-lg font-black text-white mb-2">{s.title}</h2>
                            <p className="text-zinc-400 leading-relaxed">{s.body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    )
}
