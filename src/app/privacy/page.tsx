import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold hover:text-white transition-colors mb-12">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Privacy Policy</h1>
                        <p className="text-zinc-500 text-sm">Last updated: March 1, 2026</p>
                    </div>
                </div>
                <div className="space-y-10">
                    {[
                        { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, resume content, and payment information. We also collect usage data including how you interact with the Service, device information, and IP addresses for security and analytics purposes.' },
                        { title: '2. How We Use Your Information', body: 'We use your information to provide and improve the Service, send transactional emails (registration confirmation, password reset), process payments, and communicate product updates. We do not sell your personal data to third parties.' },
                        { title: '3. AI Processing', body: 'Resume content and job descriptions you submit are processed by our AI systems (powered by Anthropic Claude) to generate career documents. Your content is not used to train third-party AI models. Data is processed over encrypted connections and is not stored beyond what is needed to deliver the Service.' },
                        { title: '4. Data Storage and Security', body: 'Your data is stored securely using Supabase (a SOC 2 compliant platform). We employ encryption at rest and in transit. We implement industry-standard security measures and conduct regular security reviews.' },
                        { title: '5. Data Sharing', body: 'We share your data only with: (a) service providers necessary to operate the platform (payment processors, email providers), (b) when required by law, and (c) with your explicit consent. We do not share your resume content or personal data with employers or recruiters.' },
                        { title: '6. Cookies and Tracking', body: 'We use essential cookies for authentication and session management. We use analytics cookies to understand usage patterns and improve the Service. You can manage cookie preferences through your browser settings.' },
                        { title: '7. Your Rights', body: 'You have the right to: access your personal data, correct inaccurate data, delete your account and all associated data, export your data in a portable format, and opt out of marketing communications. Contact privacy@novatypalcv.com to exercise these rights.' },
                        { title: '8. Data Retention', body: 'We retain your data for as long as your account is active. Upon account deletion, your personal data is deleted within 30 days, except where retention is required by law.' },
                        { title: '9. Children\'s Privacy', body: 'The Service is not directed to children under 16. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the data immediately.' },
                        { title: '10. Contact', body: 'For privacy inquiries or to exercise your rights, contact us at privacy@novatypalcv.com.' },
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
