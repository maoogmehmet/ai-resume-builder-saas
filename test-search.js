require('dotenv').config({ path: '.env.local' });
const { ApifyClient } = require('apify-client');
const client = new ApifyClient({ token: process.env.APIFY_API_KEY });

async function peopleSearch(query) {
    const run = await client.actor('apify/google-search-scraper').call({
        queries: [`site:linkedin.com/in/ "${query}"`],
        resultsPerPage: 5
    });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(items[0]?.organicResults.map(r => r.url));
}
peopleSearch('software engineer');
