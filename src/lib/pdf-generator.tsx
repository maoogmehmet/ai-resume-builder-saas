import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register Helvetica (already default, but good practice for ensuring formatting)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000000',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 15,
        textAlign: 'center',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    contact: {
        fontSize: 10,
        color: '#333333',
        marginBottom: 2,
    },
    summary: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        paddingBottom: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
        marginTop: 10,
    },
    experienceBlock: {
        marginBottom: 10,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    jobTitle: {
        fontFamily: 'Helvetica-Bold',
    },
    companyLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    company: {
        fontStyle: 'italic',
    },
    dates: {
        color: '#333',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10,
    },
    bulletLabel: {
        width: 10,
        marginRight: 2,
    },
    bulletText: {
        flex: 1,
    },
    educationBlock: {
        marginBottom: 8,
    },
    skillsBlock: {
        marginBottom: 8,
    }
});

export const ResumePDFDocument = ({ data }: { data: any }) => {
    if (!data || !data.personal_info) return <Document><Page size="A4" style={styles.page}><Text>No data available</Text></Page></Document>;

    const { personal_info, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personal_info.full_name || 'Your Name'}</Text>
                    <Text style={styles.contact}>
                        {[
                            personal_info.email,
                            personal_info.phone,
                            personal_info.location,
                            personal_info.linkedin,
                            personal_info.portfolio
                        ].filter(Boolean).join(' | ')}
                    </Text>
                </View>

                {/* SUMMARY */}
                {summary && (
                    <View style={styles.summary}>
                        <Text>{summary}</Text>
                    </View>
                )}

                {/* EXPERIENCE */}
                {experience && experience.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {experience.map((exp: any, i: number) => (
                            <View key={i} style={styles.experienceBlock}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle}>{exp.title}</Text>
                                    <Text style={styles.dates}>{exp.start_date} - {exp.end_date}</Text>
                                </View>
                                <View style={styles.companyLine}>
                                    <Text style={styles.company}>{exp.company} - {exp.location}</Text>
                                </View>
                                {exp.bullets && exp.bullets.map((bullet: string, b: number) => (
                                    <View key={b} style={styles.bulletPoint}>
                                        <Text style={styles.bulletLabel}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* EDUCATION */}
                {education && education.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {education.map((edu: any, i: number) => (
                            <View key={i} style={styles.educationBlock}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle}>{edu.school}</Text>
                                    <Text style={styles.dates}>{edu.graduation_date}</Text>
                                </View>
                                <View style={styles.companyLine}>
                                    <Text style={styles.company}>{edu.degree} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* SKILLS */}
                {skills && (skills.technical?.length > 0 || skills.soft?.length > 0) && (
                    <View>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        {skills.technical?.length > 0 && (
                            <View style={styles.skillsBlock}>
                                <Text><Text style={{ fontFamily: 'Helvetica-Bold' }}>Technical: </Text>{skills.technical.join(', ')}</Text>
                            </View>
                        )}
                        {skills.soft?.length > 0 && (
                            <View style={styles.skillsBlock}>
                                <Text><Text style={{ fontFamily: 'Helvetica-Bold' }}>Soft: </Text>{skills.soft.join(', ')}</Text>
                            </View>
                        )}
                    </View>
                )}

            </Page>
        </Document>
    );
};
