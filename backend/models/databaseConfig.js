// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const mysql = require('mysql');

var dbconnect = {
    getConnection: () => {
        var conn = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'zznk',
            database: 'sp_games',
            dateStrings: true
        });
        return conn;
    }
};

module.exports = dbconnect;