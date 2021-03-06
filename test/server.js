'use strict';

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 3000;

// AJST gh-page branch
app.use('/', express.static(__dirname + '/../../Async-JSTemplate-page'));

// AJST module serving
app.use('/ajst', express.static(__dirname + '/../dist')); // for develope ajst..

// Server Start
server.listen(port, () => console.log(`Express on : http://127.0.0.1:${port}`));
