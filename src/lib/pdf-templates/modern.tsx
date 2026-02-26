import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 9,
    },
    leftColumn: {
        width: '30%',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 20,
        height: '100%',
    },
    rightColumn: {
        width: '70%',
        padding: 30,
    },
    name: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 5,
        color: '#fff',
    },
    sidebarTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginTop: 20,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 2,
        textTransform: 'uppercase',
    },
    mainTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#1a1a1a',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#1a1a1a',
        paddingBottom: 4,
        textTransform: 'uppercase',
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    jobTitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
    },
    company: {
        fontStyle: 'italic',
        marginBottom: 5,
        color: '#444',
    },
    dates: {
        color: '#666',
        fontSize: 8,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 5,
    },
    bulletLabel: {
        width: 8,
    },
    bulletText: {
        flex: 1,
        color: '#333',
    },
    section: {
        marginBottom: 20,
    },
    contactItem: {
        marginBottom: 5,
        fontSize: 8,
    }
});

export const ModernTemplate = ({ data }: { data: any }) => {
    const { personal_info, summary, experience, education, skills } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* LEFT SIDEBAR */}
                <View style={styles.leftColumn}>
                    <Text style={styles.name}>{personal_info.full_name}</Text>

                    <View>
                        <Text style={styles.sidebarTitle}>Contact</Text>
                        {personal_info.email && <Text style={styles.contactItem}>{personal_info.email}</Text>}
                        {personal_info.phone && <Text style={styles.contactItem}>{personal_info.phone}</Text>}
                        {personal_info.location && <Text style={styles.contactItem}>{personal_info.location}</Text>}
                        {personal_info.linkedin && <Text style={styles.contactItem}>LinkedIn</Text>}
                    </View>

                    <View>
                        <Text style={styles.sidebarTitle}>Skills</Text>
                        {skills.technical?.map((s: string, i: number) => (
                            <Text key={i} style={{ marginBottom: 3 }}>• {s}</Text>
                        ))}
                    </View>

                    {education && education.length > 0 && (
                        <View>
                            <Text style={styles.sidebarTitle}>Education</Text>
                            {education.map((edu: any, i: number) => (
                                <View key={i} style={{ marginBottom: 10 }}>
                                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8 }}>{edu.school}</Text>
                                    <Text style={{ fontSize: 7, color: '#aaa' }}>{edu.degree}</Text>
                                    <Text style={{ fontSize: 7, color: '#888' }}>{edu.graduation_date}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.rightColumn}>
                    <View style={styles.section}>
                        <Text style={styles.mainTitle}>Profile</Text>
                        <Text style={{ lineHeight: 1.4, color: '#444' }}>{summary}</Text>
                    </View>

                    {experience && experience.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.mainTitle}>Experience</Text>
                            {experience.map((exp: any, i: number) => (
                                <View key={i} style={{ marginBottom: 15 }}>
                                    <View style={styles.jobHeader}>
                                        <Text style={styles.jobTitle}>{exp.title}</Text>
                                        <Text style={styles.dates}>{exp.start_date} - {exp.end_date}</Text>
                                    </View>
                                    <Text style={styles.company}>{exp.company}, {exp.location}</Text>
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
                </View>
            </Page>
        </Document>
    );
};
