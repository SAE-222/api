const express = require('express');
const app = express();


for (file of fs.readdirSync('./api/routes')) {
    if (file.endswith('.js')) {
        app.use('/api/' + file.split('.')[0], require('./api/routes/' + file));
    }
}

module.exports = app;