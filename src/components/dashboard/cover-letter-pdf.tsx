import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Removed woff2 font registration to fix "Unknown font format" error in react-pdf

const styles = StyleSheet.create({
    page: {
        padding: 50,
        color: '#1a1a1a',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    slideTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    slideSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 30,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    slideContent: {
        fontSize: 14,
        lineHeight: 1.8,
        color: '#374151',
    },
    legacyHeader: {
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 20,
    },
    legacyFullName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 5,
    },
    legacyContactInfo: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
    },
    legacyMetaSection: {
        marginBottom: 30,
    },
    legacyMetaText: {
        fontSize: 11,
        color: '#374151',
        marginBottom: 4,
    },
    legacyCompanyName: {
        fontWeight: 'bold',
    },
    legacyBody: {
        fontSize: 11,
        lineHeight: 1.6,
        color: '#374151',
    },
    footerBadge: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        fontSize: 9,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

interface CoverLetterPDFProps {
    fullName: string;
    email: string;
    targetRole: string;
    companyName: string;
    content: string;
    date: string;
}

export function CoverLetterPDF({ fullName, email, targetRole, companyName, content, date }: CoverLetterPDFProps) {
    let slides: any[] = [];
    let isLegacy = false;
    let legacyContent = { letter_body: content, why_company: '', why_me: '' };

    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            slides = parsed;
        } else if (parsed.letter_body) {
            isLegacy = true;
            legacyContent = parsed;
        } else {
            isLegacy = true;
        }
    } catch (e) {
        isLegacy = true;
    }

    if (isLegacy) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.legacyHeader}>
                        <Text style={styles.legacyFullName}>{fullName}</Text>
                        <Text style={styles.legacyContactInfo}>{email}</Text>
                    </View>
                    <View style={styles.legacyMetaSection}>
                        <Text style={styles.legacyMetaText}>{date}</Text>
                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.legacyMetaText}>Hiring Manager</Text>
                            <Text style={[styles.legacyMetaText, styles.legacyCompanyName]}>{companyName}</Text>
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <Text style={[styles.legacyMetaText, { fontWeight: 'bold' }]}>Application for {targetRole}</Text>
                        </View>
                    </View>
                    <View style={styles.legacyBody}>
                        <Text>{legacyContent.letter_body}</Text>
                        {legacyContent.why_company && (
                            <View style={{ marginTop: 25 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#111827', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>Why {companyName}?</Text>
                                <Text>{legacyContent.why_company}</Text>
                            </View>
                        )}
                        {legacyContent.why_me && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#111827', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>Why Me?</Text>
                                <Text>{legacyContent.why_me}</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={{ fontSize: 11, color: '#374151', marginBottom: 40 }}>Sincerely,</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#111827' }}>{fullName}</Text>
                    </View>
                </Page>
            </Document>
        )
    }

    // New Pitch Deck Format
    return (
        <Document>
            {slides.map((slide, idx) => (
                <Page key={idx} size="A4" orientation="landscape" style={styles.page}>
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                        <Text style={styles.slideTitle}>{slide.title}</Text>
                        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                        <Text style={styles.slideContent}>{slide.content}</Text>
                    </View>
                    <Text style={styles.footerBadge}>{fullName} • {targetRole} at {companyName} • Page {idx + 1}</Text>
                </Page>
            ))}
        </Document>
    );
}
