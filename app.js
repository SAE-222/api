const express = require('express');
const app = express();


for (file of fs.readdirSync('./api/routes')) {
    if (file.endswith('.js')) {
        app.use('/' + file.split('.')[0], require('./api/routes/' + file));
        // console.log(`- Route ${file} montée`)
        // Pour un fichier example.js, revient à faire app.use('/examples', require('./api/routes/example.js'));
        // Monte donc les routes une par une
    }
}

module.exports = app;