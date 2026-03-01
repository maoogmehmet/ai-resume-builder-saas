import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FCFCFC',
        fontFamily: 'Helvetica',
        fontSize: 9,
        lineHeight: 1.4,
    },
    leftColumn: {
        width: '32%',
        backgroundColor: '#1E293B', // Deep Slate
        color: '#F1F5F9',
        padding: 24,
        height: '100%',
    },
    rightColumn: {
        width: '68%',
        padding: 32,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#334155',
        alignSelf: 'center',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sidebarTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        marginTop: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    mainTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#0F172A',
        marginBottom: 12,
        paddingBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#E2E8F0',
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    jobTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        color: '#1E293B',
    },
    company: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        marginBottom: 6,
        color: '#64748B',
    },
    dates: {
        color: '#64748B',
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 4,
    },
    bulletLabel: {
        width: 10,
        color: '#94A3B8',
    },
    bulletText: {
        flex: 1,
        color: '#334155',
    },
    section: {
        marginBottom: 24,
    },
    contactItem: {
        marginBottom: 8,
        fontSize: 8.5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    skillBadge: {
        backgroundColor: '#334155',
        padding: '3 6',
        borderRadius: 4,
        fontSize: 7.5,
        marginBottom: 4,
        marginRight: 4,
        color: '#F1F5F9',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    }
});

export const ModernTemplate = ({ data }: { data: any }) => {
    const { personal_info, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* LEFT SIDEBAR */}
                <View style={styles.leftColumn}>
                    {personal_info.profile_image && (
                        <Image src={personal_info.profile_image} style={styles.profileImage} />
                    )}
                    <Text style={styles.name}>{personal_info.full_name}</Text>
                    <Text style={styles.headerSubtitle}>{experience?.[0]?.position || experience?.[0]?.title || 'Professional'}</Text>

                    <View>
                        <Text style={styles.sidebarTitle}>Contact</Text>
                        {personal_info.email && <Text style={styles.contactItem}>Email: {personal_info.email}</Text>}
                        {personal_info.phone && <Text style={styles.contactItem}>Phone: {personal_info.phone}</Text>}
                        {personal_info.location && <Text style={styles.contactItem}>Loc: {personal_info.location}</Text>}
                        {personal_info.linkedin && <Text style={styles.contactItem}>LinkedIn: /in/{personal_info.linkedin.split('/').pop()}</Text>}
                    </View>

                    <View>
                        <Text style={styles.sidebarTitle}>Expertise</Text>
                        <View style={styles.skillsContainer}>
                            {skills?.technical?.map((s: string, i: number) => (
                                <Text key={i} style={styles.skillBadge}>{s}</Text>
                            ))}
                        </View>
                    </View>

                    {education && education.length > 0 && (
                        <View>
                            <Text style={styles.sidebarTitle}>Education</Text>
                            {education.map((edu: any, i: number) => (
                                <View key={i} style={{ marginBottom: 12 }}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9 }}>{edu.school}</Text>
                                    <Text style={{ fontSize: 8, color: '#CBD5E1', marginTop: 2 }}>{edu.degree}</Text>
                                    <Text style={{ fontSize: 7, color: '#94A3B8' }}>{edu.graduation_date}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.rightColumn}>
                    <View style={styles.section}>
                        <Text style={styles.mainTitle}>Executive Summary</Text>
                        <Text style={{ color: '#334155', lineHeight: 1.5 }}>{summary}</Text>
                    </View>

                    {experience && experience.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.mainTitle}>Professional Experience</Text>
                            {experience.map((exp: any, i: number) => (
                                <View key={i} style={{ marginBottom: 20 }}>
                                    <View style={styles.jobHeader}>
                                        <Text style={styles.jobTitle}>{exp.position || exp.title}</Text>
                                        <Text style={styles.dates}>{exp.start_date} - {exp.end_date}</Text>
                                    </View>
                                    <Text style={styles.company}>{exp.company} | {exp.location}</Text>
                                    {exp.bullets?.map((bullet: string, b: number) => (
                                        <View key={b} style={styles.bulletPoint}>
                                            <Text style={styles.bulletLabel}>•</Text>
                                            <Text style={styles.bulletText}>{bullet}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {data.additional_explanations && (
                        <View style={styles.section}>
                            <Text style={styles.mainTitle}>Additional Information</Text>
                            <Text style={{ color: '#334155', lineHeight: 1.5 }}>{data.additional_explanations}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};
