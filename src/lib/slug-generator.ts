export function generateSlug(fullName?: string, jobTitle?: string): string {
    const parts = [fullName, jobTitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // replace multiple hyphens with single
        .substring(0, 60);

    return parts || `resume-${Date.now()}`;
}
