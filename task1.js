const http = require('http');
const url = require('url');

let users = [
    { id: '1', firstName: 'John', lastName: 'Doe', status: 'online', friends: ['2', '3'] },
    { id: '2', firstName: 'Jane', lastName: 'Doe', status: 'online', friends: ['1', '4'] },
    { id: '3', firstName: 'Jim', lastName: 'Smith', status: 'offline', friends: ['1'] },
    { id: '4', firstName: 'Jill', lastName: 'Johnson', status: 'online', friends: ['2'] },
    { id: '5', firstName: 'Jake', lastName: 'Jones', status: 'offline', friends: [] }
];

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const { pathname, query } = reqUrl;

    if (req.method === 'GET') {
        if (pathname === '/getUserList') {
            console.log(users);
            res.end(JSON.stringify(users));
        } else if (pathname === '/getUserByID') {
            const user = users.find(user => user.id === query.id);
            console.log(user);
            res.end(JSON.stringify(user));
        }
    } else if (req.method === 'POST') {
        if (pathname === '/createUser') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const user = JSON.parse(body);
                users.push(user);
                console.log(user);
                res.end(JSON.stringify(user));
            });
        }
    } else if (req.method === 'PUT') {
        if (pathname === '/updateUser') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const updatedUser = JSON.parse(body);
                users = users.map(user => user.id === updatedUser.id ? updatedUser : user);
                console.log(updatedUser);
                res.end(JSON.stringify(updatedUser));
            });
        }
    } else if (req.method === 'DELETE') {
        if (pathname === '/deleteUser') {
            const id = query.id.toString();
            users = users.filter(user => user.id !== id);
            users.forEach(user => {
                if (user.friends) {
                    user.friends = user.friends.filter(friendId => friendId !== id);
                }
            });            
            console.log(`User with id ${id} deleted`);
            res.end(`User with id ${id} deleted`);
        }             
    }
});

server.listen(3000, () => console.log('Server is running on port 3000'));

const testEndpoints = () => {
    http.get('http://localhost:3000/getUserList', (res) => {
        res.on('data', () => {});
        res.on('end', () => console.log('getUserList test done'));
    });

    http.get('http://localhost:3000/getUserByID?id=1', (res) => {
        res.on('data', () => {});
        res.on('end', () => console.log('getUserByID test done'));
    });

    const newUser = JSON.stringify({ id: '6', firstName: 'Test', lastName: 'User' });
    const createOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/createUser',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': newUser.length
        }
    };
    const createReq = http.request(createOptions, (res) => {
        res.on('data', () => {});
        res.on('end', () => console.log('createUser test done'));
    });
    createReq.write(newUser);
    createReq.end();

    const updatedUser = JSON.stringify({ id: '6', firstName: 'UpdatedTest' });
    const updateOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/updateUser',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': updatedUser.length
        }
    };
    const updateReq = http.request(updateOptions, (res) => {
        res.on('data', () => {});
        res.on('end', () => console.log('updateUser test done'));
    });
    updateReq.write(updatedUser);
    updateReq.end();

     const deleteOptions = {
         hostname:'localhost',
         port:'3000',
         path:'/deleteUser?id=4',
         method:'DELETE'
     };
     const deleteReq = http.request(deleteOptions, (res) => {
         res.on('data', () => {});
         res.on('end', () => console.log('deleteUser test done'));
     });
     deleteReq.end();
};

setTimeout(testEndpoints, 1000);
