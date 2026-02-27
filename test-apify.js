require('dotenv').config({ path: '.env.local' });
const { ApifyClient } = require('apify-client');

const client = new ApifyClient({
    token: process.env.APIFY_API_KEY,
});

async function testJobs() {
    const keyword = "software";
    const encodedQuery = encodeURIComponent(keyword);
    const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&f_TPR=r604800`;

    console.log("Testing Jobs...");
    try {
        const run = await client.actor('curious_coder/linkedin-jobs-scraper').call({
            urls: [linkedInSearchUrl],
            count: 100, // Minimum allowed
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log("Jobs Length:", items.length);
        if (items.length > 0) {
            console.log("First Job Title:", items[0].title || items[0].jobTitle || items[0].position);
        }
    } catch (e) {
        console.error("Jobs error:", e.message || e);
    }
}

async function testPeople() {
    console.log("\nTesting People...");
    const linkedInPeopleUrl = `https://www.linkedin.com/search/results/people/?keywords=software&origin=GLOBAL_SEARCH_HEADER`;

    try {
        const run = await client.actor('dev_fusion/linkedin-profile-scraper').call({
            profileUrls: [linkedInPeopleUrl],
            // Wait, does it accept a search URL as a profileUrl? Let's trace it.
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log("People Length:", items.length);
        if (items.length > 0) {
            console.log("First Person Name:", items[0].fullName || items[0].name || items[0].firstName);
        }
    } catch (e) {
        console.error("People error:", e.message || e);
    }
}

async function main() {
    await testJobs();
    await testPeople();
}
main();
