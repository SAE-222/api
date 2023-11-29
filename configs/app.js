const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

// Gestion des erreurs
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Une erreur s\'est produite!');
}

app.use(errorHandler); // Utilisation du gestionnaire d'erreurs

const routesDir = path.join(__dirname, '../routes');

const routeFiles = fs.readdirSync(routesDir);

routeFiles.forEach((file) => {
    try {
        if (file.endsWith('.js')) {
            const routeName = file.split('.')[0]; // Nom de la route sans l'extension .js
            const routePath = `/api/${routeName}`; // Chemin de la route

            const route = require(path.join(routesDir, file));
            app.use(routePath, route);
        }
    } catch (err) {
        console.error('Une erreur est survenue lors du montage des routes de l\'API :', err);
    }
});

module.exports = app;
