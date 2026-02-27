const APIFY_TOKEN = process.env.APIFY_API_KEY;

async function run() {
    const input = {
        urls: ["https://www.linkedin.com/jobs/search/?keywords=ai"],
        publishedAt: "anyTime",
        limit: 1
    };
    const url = `https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    console.log(res.status);
    console.log(await res.text());
}
run();
