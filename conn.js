const mariadb = require('mariadb');

const pool = mariadb.createPool({
        host: '192.168.1.18',
        user: 'api',
        password: '1HNGsEiI08U7MoNJ',
        connectionLimit: 5,
        database : 'nocifDB'
});

async function connectToDatabase() {
    try {
        const conn = await pool.getConnection();
        console.log('Connecté à la base de données');
        return conn;
    } catch (err) {
        console.error('Erreur de connexion à la base de données :', err);
        throw err;
    }
}

module.exports = { connectToDatabase };