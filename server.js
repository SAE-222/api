// node server.js
// http://localhost:3000

const http = require('http');
const app = require('./app');

const port = process.env.APIPORT || 8393;
const server = http.createServer();

server.listen(port);