import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6,
        color: '#1A1A1A',
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 3,
        borderBottomColor: '#000000',
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerLeft: {
        flex: 1,
    },
    name: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 0, // Square for Executive look
        borderWidth: 1,
        borderColor: '#EEE',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        fontSize: 9,
        color: '#444',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        backgroundColor: '#F8F8F8',
        padding: '6 10',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    experienceItem: {
        marginBottom: 20,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    jobName: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
    },
    companyName: {
        fontSize: 10,
        color: '#333',
        fontFamily: 'Helvetica-Oblique',
        marginBottom: 6,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingLeft: 12,
    },
    bulletLabel: {
        width: 10,
        fontSize: 12,
        marginTop: -2,
    },
    bulletText: {
        flex: 1,
        fontSize: 9.5,
        color: '#333',
    },
    skillsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        borderWidth: 1,
        borderColor: '#DDD',
        padding: '4 8',
        fontSize: 8,
        color: '#444',
    }
});

export const ExecutiveTemplate = ({ data }: { data: any }) => {
    const { personal_info, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.name}>{personal_info.full_name}</Text>
                        <Text style={styles.title}>{experience?.[0]?.position || experience?.[0]?.title || 'Professional'}</Text>
                    </View>
                    {personal_info.profile_image && (
                        <Image src={personal_info.profile_image} style={styles.profileImage} />
                    )}
                </View>

                <View style={styles.contactRow}>
                    <Text>{personal_info.email}</Text>
                    <Text>{personal_info.phone}</Text>
                    <Text>{personal_info.location}</Text>
                    {personal_info.linkedin && <Text>LinkedIn</Text>}
                </View>

                <View style={{ marginBottom: 25 }}>
                    <Text style={styles.sectionTitle}>Executive Summary</Text>
                    <Text style={{ fontSize: 10, color: '#222', textAlign: 'justify' }}>{summary}</Text>
                </View>

                {experience && experience.length > 0 && (
                    <View style={{ marginBottom: 25 }}>
                        <Text style={styles.sectionTitle}>Professional Track Record</Text>
                        {experience.map((exp: any, i: number) => (
                            <View key={i} style={styles.experienceItem}>
                                <View style={styles.jobHeader}>
                                    <View>
                                        <Text style={styles.jobName}>{exp.position || exp.title}</Text>
                                        <Text style={styles.companyName}>{exp.company} | {exp.location}</Text>
                                    </View>
                                    <Text style={{ fontSize: 9, color: '#666' }}>{exp.start_date} — {exp.end_date}</Text>
                                </View>
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

                <View style={{ flexDirection: 'row', gap: 30 }}>
                    {education && education.length > 0 && (
                        <View style={{ flex: 1 }}>
                            <Text style={styles.sectionTitle}>Education</Text>
                            {education.map((edu: any, i: number) => (
                                <View key={i} style={{ marginBottom: 10 }}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{edu.school}</Text>
                                    <Text style={{ fontSize: 9, color: '#444' }}>{edu.degree}</Text>
                                    <Text style={{ fontSize: 8, color: '#888' }}>{edu.graduation_date}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>Key Competencies</Text>
                        <View style={styles.skillsGrid}>
                            {skills?.technical?.map((s: string, i: number) => (
                                <Text key={i} style={styles.skillBadge}>{s}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {data.additional_explanations && (
                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.sectionTitle}>Strategic Projects & Additional Info</Text>
                        <Text style={{ fontSize: 9.5, color: '#222', textAlign: 'justify' }}>{data.additional_explanations}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};
