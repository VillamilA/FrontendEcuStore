// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const db = require('./databaseConfig');
const Platform = {
    addPlatform: (reqBody, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var addPlatformQuery = 'INSERT INTO platform (platform_name, description) VALUES (?, ?);';
                dbConn.query(addPlatformQuery, [reqBody.platform_name, reqBody.description], (error) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        return callback(error);
                    };
                    return callback(null);
                });
            };
        });
    },
}

module.exports = Platform;