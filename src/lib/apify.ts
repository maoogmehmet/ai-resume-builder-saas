import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

export async function scrapeLinkedInProfile(profileUrl: string) {
    try {
        const run = await client.actor('dev_fusion/linkedin-profile-scraper').call({
            profileUrls: [profileUrl],
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        return items[0]; // İlk sonuç
    } catch (error) {
        console.error("Apify scraping failed:", error);
        throw new Error("Failed to scrape LinkedIn profile.");
    }
}
