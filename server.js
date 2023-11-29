
const http = require('http');
const app = require('./configs/app');

const port = process.env.APIPORT || 8393;
const server = http.createServer(app);

server.on('error', (error) => {
    console.error('Une erreur s\'est produite lors du démarrage de l\'API :', error);
});

server.listen(port, () => {
    console.log(`API en cours d'exécution sur le port ${port}`);
});
