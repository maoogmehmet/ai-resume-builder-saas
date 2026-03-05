import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

type Testimonial = {
    name: string
    role: string
    image: string
    quote: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Jonathan Yombo',
        role: 'Software Engineer',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        quote: 'Imported my LinkedIn in seconds and got an ATS ready resume with strong bullets that actually show impact.',
    },
    {
        name: 'Yves Kalume',
        role: 'Product Manager',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        quote: 'Job optimization made the difference each version matches the role, highlights results and feels tailored to recruiters.',
    },
    {
        name: 'Yucel Faruksahan',
        role: 'Frontend Developer',
        image: 'https://randomuser.me/api/portraits/men/7.jpg',
        quote: 'Clean PDF export looks professional and ATS safe, with no messy formatting, weird spacing or unnecessary design.',
    },
    {
        name: 'Anonymous author',
        role: 'Data Analyst',
        image: 'https://randomuser.me/api/portraits/men/8.jpg',
        quote: 'The ATS score and missing keywords list tell me exactly what to fix before I apply anywhere.',
    },
    {
        name: 'Shekinah Tshiokufila',
        role: 'Senior Backend Engineer',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        quote: 'Creating multiple resume versions is effortless—switching, editing, and exporting takes seconds, not hours anymore.',
    },
    {
        name: 'Oketa Fred',
        role: 'UX Designer',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        quote: 'The editor feels premium: live preview, quick tweaks, and consistent layout make updates fast and stress free.',
    },
    {
        name: 'Zeki',
        role: 'Cybersecurity Analyst',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
        quote: 'AI suggestions are practical, turning duties into measurable achievements with stronger verbs and better clarity.',
    },
    {
        name: 'Joseph Kitheka',
        role: 'Marketing Specialist',
        image: 'https://randomuser.me/api/portraits/men/9.jpg',
        quote: 'The public resume link is perfect for recruiters—simple to open, easy to share, and always looks clean.',
    },
    {
        name: 'Khatab Wedaa',
        role: 'Career Changer',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
        quote: 'It transformed my messy LinkedIn into a structured resume with a confident summary and clear, relevant highlights.',
    },
    {
        name: 'Rodrigo Aguilar',
        role: 'Customer Success Manager',
        image: 'https://randomuser.me/api/portraits/men/11.jpg',
        quote: 'Everything is streamlined: import, generate, refine, and export—so I can apply faster with more confidence.',
    },
    {
        name: 'Eric Ampire',
        role: 'DevOps Engineer',
        image: 'https://randomuser.me/api/portraits/men/12.jpg',
        quote: 'Pasting a job description and generating a tailored version feels like having a resume expert on demand.',
    },
    {
        name: 'Roland Tubonge',
        role: 'Recent Graduate',
        image: 'https://randomuser.me/api/portraits/men/13.jpg',
        quote: 'From zero to a complete resume in one session—simple workflow, clear guidance, and results that look legit.',
    },
]

const chunkArray = (array: Testimonial[], chunkSize: number): Testimonial[][] => {
    const result: Testimonial[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
    }
    return result
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3))

export default function WallOfLoveSection() {
    return (
        <section>
            <div className="py-16 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold">Loved by the Community</h2>
                        <p className="mt-6">Harum quae dolore orrupti aut temporibus ariatur.</p>
                    </div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                        {testimonialChunks.map((chunk, chunkIndex) => (
                            <div
                                key={chunkIndex}
                                className="space-y-3">
                                {chunk.map(({ name, role, quote, image }, index) => (
                                    <Card key={index}>
                                        <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                                            <Avatar className="size-9">
                                                <AvatarImage
                                                    alt={name}
                                                    src={image}
                                                    loading="lazy"
                                                    width="120"
                                                    height="120"
                                                />
                                                <AvatarFallback>ST</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-medium">{name}</h3>

                                                <span className="text-muted-foreground block text-sm tracking-wide">{role}</span>

                                                <blockquote className="mt-3">
                                                    <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                                                </blockquote>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
