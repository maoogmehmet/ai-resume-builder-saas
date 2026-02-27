const fetch = require('node-fetch'); // or use built in fetch if Node 18+

async function testJobs() {
    console.log("Testing Jobs API route...");
    try {
        const res = await fetch('http://localhost:3000/api/linkedin/search-jobs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cookie': 'sb-jymwzyeogprmofhssglt-auth-token=some-token'}, // We need valid auth to hit the API route!
            body: JSON.stringify({ query: 'software' })
        });
        const json = await res.json();
        console.log("Jobs Response:", json);
    } catch(e) {
        console.log(e);
    }
}
testJobs();
