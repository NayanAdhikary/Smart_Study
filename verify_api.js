const http = require('http');

const urls = [
    'http://localhost:5000/api/departments',
    'http://127.0.0.1:5000/api/departments',
    'http://localhost:5000/api/departments/', // With trailing slash
];

function checkUrl(url) {
    console.log(`Checking ${url}...`);
    const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`[${res.statusCode}] ${url}`);
            console.log(`Data length: ${data.length}`);
            if (res.statusCode === 200) {
                console.log(`Sample Data: ${data.substring(0, 100)}...`);
            }
        });
    });

    req.on('error', (e) => {
        console.log(`[ERROR] ${url}: ${e.message}`);
    });
}

urls.forEach(checkUrl);
