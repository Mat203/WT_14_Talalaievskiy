const fs = require('fs');
const http = require('http');

function readFileSync() {
    let start = Date.now();
    let data = fs.readFileSync('bigfile.txt', 'utf8');
    let end = Date.now();
    console.log('Sync done in ' + (end - start) + 'ms');
    return data;
}

function readFileAsync(callback) {
    let start = Date.now();
    fs.readFile('bigfile.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let end = Date.now();
        console.log('Async done in ' + (end - start) + 'ms');
        callback(data);
    });
}

const server = http.createServer((req, res) => {
    if (req.url === '/getSync') {
        let data = readFileSync();
        res.end(data);
    } else if (req.url === '/getAsync') {
        readFileAsync((data) => {
            res.end(data);
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


http.get('http://localhost:3000/getSync', (res) => {
    res.on('data', (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
    });
});

http.get('http://localhost:3000/getAsync', (res) => {
    res.on('data', (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
    });
});
