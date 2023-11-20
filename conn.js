const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'mydb.com', 
    user:'myUser', 
    password: 'myPassword',
    connectionLimit: 5
});

const conn = pool.getConnection(); // async

module.exports = conn;