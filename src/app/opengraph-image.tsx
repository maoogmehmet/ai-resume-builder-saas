import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Novatypalcv - AI Resume Builder'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        borderRadius: '160px',
                        width: '400px',
                        height: '400px',
                        marginBottom: '40px',
                    }}
                >
                    <svg
                        width="280"
                        height="280"
                        viewBox="0 0 100 100"
                        fill="none"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="black"
                            strokeWidth="8"
                        />
                        <path
                            d="M34 66V34L66 66V34"
                            stroke="black"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div
                    style={{
                        fontSize: 120,
                        fontWeight: 'bold',
                        color: 'white',
                        letterSpacing: '-0.05em',
                    }}
                >
                    Novatypalcv
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
