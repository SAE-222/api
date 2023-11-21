const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Gestion des erreurs
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Une erreur s\'est produite!');
}

app.use(errorHandler); // Utilisation du gestionnaire d'erreurs

for (const file of fs.readdirSync('./api/routes')) {
    try {
        if (file.endsWith('.js')) {
            app.use('/api/' + file.split('.')[0], require('./api/routes/' + file));
        }
    } catch (err) {
        console.error('Une erreur est survenue :', err);
    }
}

module.exports = app;
