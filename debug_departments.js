const http = require('http');

console.log("Attempting to fetch from http://127.0.0.1:5000/api/departments");

const req = http.get('http://127.0.0.1:5000/api/departments', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        console.log('Status:', resp.statusCode);
        console.log('Data:', data);
    });

});

req.on("error", (err) => {
    console.log("Request Error:", err);
});
