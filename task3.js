const http = require('http');
const os = require('os');

function getOSInfo() {
    return {
        Type: os.type(),
        Version: os.release(),
        Architecture: os.arch(),
        CpuInfo: os.cpus(),
        is64Bit: os.arch() === 'x64',
        TotalMemory: os.totalmem(),
        FreeMemory: os.freemem(),
        UserInfo: os.userInfo()
    };
}

const server = http.createServer((req, res) => {
    if (req.url === '/getOSInfo') {
        const info = getOSInfo();
        console.log(info);
        res.end(JSON.stringify(info));
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

http.get('http://localhost:3000/getOSInfo')
