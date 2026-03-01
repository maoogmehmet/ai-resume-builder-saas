const APIFY_TOKEN = process.env.APIFY_API_KEY || '';

async function apifyRun(actorId: string, input: any, timeoutSecs: number = 60) {
    if (!APIFY_TOKEN) throw new Error("Missing APIFY_API_KEY in environment");

    const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=${timeoutSecs}`;

    console.log(`[Apify] Calling actor ${actorId} with timeout: ${timeoutSecs}s`);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        let errorMsg = await response.text();
        try {
            const parsed = JSON.parse(errorMsg);
            if (parsed.error && parsed.error.message) errorMsg = parsed.error.message;
        } catch (e) {
            // Keep raw text
        }
        throw new Error(`Apify Actor ${actorId} failed: ${errorMsg}`);
    }

    const items = await response.json();
    return Array.isArray(items) ? items : [];
}

// ─────────────────────────────────────────────────────────────────
// LinkedIn Profile Scraper
// ─────────────────────────────────────────────────────────────────
export async function scrapeLinkedInProfile(profileUrl: string) {
    console.log(`[Apify] Scraping profile: ${profileUrl}`);

    const items = await apifyRun('dev_fusion~linkedin-profile-scraper', {
        profileUrls: [profileUrl],
    });

    if (!items || items.length === 0) {
        throw new Error('No profile data returned. The profile may be private or cookies may be required/expired.');
    }
    return items[0];
}

// ─────────────────────────────────────────────────────────────────
// LinkedIn Jobs Search
// ─────────────────────────────────────────────────────────────────
export async function searchLinkedInJobs(keyword: string, location: string = ''): Promise<any[]> {
    console.log(`[Apify] Searching jobs: "${keyword}" in "${location}"`);

    const searchUrl = new URL('https://www.linkedin.com/jobs/search/');
    searchUrl.searchParams.append('keywords', keyword);
    if (location) {
        searchUrl.searchParams.append('location', location);
    }

    const input = {
        urls: [searchUrl.toString()],
        publishedAt: "anyTime",
        count: 100, // Actor requires min 100, returns all available
        scrapeCompany: false         // Crucial to avoid extreme timeouts
    };

    const items = await apifyRun('curious_coder~linkedin-jobs-scraper', input, 180);

    console.log(`[Apify] Raw jobs count: ${items.length}`);

    return items.map((item: any) => {
        let rawUrl = item.jobUrl || item.url || item.applyUrl || '#';
        // Ensure absolute URL
        if (rawUrl !== '#' && !rawUrl.startsWith('http')) {
            rawUrl = `https://www.linkedin.com${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
        }
        return {
            title: item.title || item.jobTitle || item.position || 'Unknown Position',
            companyName: item.companyName || item.company || item.employer || 'Unknown Company',
            location: item.location || item.jobLocation || '',
            jobUrl: rawUrl,
            salary: item.salary || item.salaryRange || null,
            postedAt: item.postedAt || item.datePosted || item.publishedAt || null,
            type: item.employmentType || item.jobType || null,
            companyLogo: item.companyLogo || item.logo || null,
            description: item.description ? item.description.slice(0, 200) + '...' : null,
        };
    });
}

// ─────────────────────────────────────────────────────────────────
// LinkedIn People Search
// Actor: dev_fusion/linkedin-profile-scraper CANNOT search by keyword directly.
// We must use Google Search to find LinkedIn profiles matching the role, 
// then scrape those specific URLs using dev_fusion.
// ─────────────────────────────────────────────────────────────────
export async function searchLinkedInPeople(keyword: string, limit: number = 5): Promise<any[]> {
    console.log(`[Apify] Searching people via Google for: "${keyword}"`);

    // 1. Get raw URLs via Google Search
    const searchItems = await apifyRun('apify~google-search-scraper', {
        queries: [`site:linkedin.com/in/ "${keyword}"`],
        resultsPerPage: limit + 5,
        maxPagesPerQuery: 1,
    });

    if (!searchItems || searchItems.length === 0 || !searchItems[0].organicResults) {
        throw new Error('No LinkedIn profiles found for this search.');
    }

    // Extract raw URLs, ensuring they look like valid LinkedIn profiles
    const validUrls = (searchItems[0].organicResults as any[])
        .map(r => r.url)
        .filter(url => url && url.includes('linkedin.com/in/'))
        .slice(0, limit);

    if (validUrls.length === 0) {
        throw new Error('No valid LinkedIn profile URLs found.');
    }

    console.log(`[Apify] Found ${validUrls.length} profile URLs. Now scraping with dev_fusion...`);

    // 2. Scrape the deep profiles using dev_fusion
    const scrapedProfiles = await apifyRun('dev_fusion~linkedin-profile-scraper', {
        profileUrls: validUrls,
    }, 60);

    console.log(`[Apify] Successfully scraped ${scrapedProfiles.length} detailed profiles.`);

    // 3. Map to standard format
    return scrapedProfiles.map((item: any) => ({
        fullName: item.fullName || item.name || item.firstName
            ? `${item.firstName || ''} ${item.lastName || ''}`.trim()
            : 'Unknown',
        headline: item.headline || item.title || item.currentPosition || '',
        location: item.location || item.addressWithCountry || item.country || '',
        profilePicture: item.profilePicture || item.photoUrl || item.photo || null,
        url: item.url || item.profileUrl || item.linkedInUrl || '#',
        currentCompany: item.currentCompany || item.company || null,
        connectionDegree: item.connectionDegree || null,
    }));
}

export async function scrapeSingleLinkedInJob(jobUrl: string) {
    if (!jobUrl || !jobUrl.includes('linkedin.com/jobs/')) {
        throw new Error('Invalid LinkedIn Job URL');
    }

    const items = await apifyRun('curious_coder~linkedin-jobs-scraper', {
        urls: [jobUrl],
        count: 100,
        scrapeCompany: false
    }, 180);

    if (!items || items.length === 0) {
        throw new Error('Could not scrape job data');
    }

    const jobData = items[0];

    return {
        title: jobData.title || jobData.jobTitle || 'Unknown Title',
        company: jobData.companyName || jobData.company || 'Unknown Company',
        description: jobData.descriptionText || jobData.descriptionHTML || jobData.description || ''
    };
}

// ─────────────────────────────────────────────────────────────────
// Company Intelligence Search (Google)
// Used to gather recent context about a company for cover letters
// ─────────────────────────────────────────────────────────────────
export async function searchCompanyInfo(companyName: string): Promise<string> {
    console.log(`[Apify] Gathering intelligence for company: "${companyName}"`);

    try {
        const searchItems = await apifyRun('apify~google-search-scraper', {
            queries: [`"${companyName}" company mission vision about us recent news`],
            resultsPerPage: 3,
            maxPagesPerQuery: 1,
        });

        if (!searchItems || searchItems.length === 0 || !searchItems[0].organicResults) {
            return `No specific intelligence found for ${companyName}.`;
        }

        const results = searchItems[0].organicResults.slice(0, 3);
        const contextLines = results.map((r: any) => `- ${r.title}: ${r.description}`);

        return `Recent public info for ${companyName}:\n${contextLines.join('\n')}`;
    } catch (e: any) {
        console.error(`[Apify] Company search failed for ${companyName}:`, e.message);
        return `Could not fetch specific intelligence for ${companyName}.`;
    }
}
