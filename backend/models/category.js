// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const db = require('./databaseConfig');
const Category = {
    addCategory: (reqBody, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var addCategoryQuery = 'INSERT INTO category (catname, description) VALUES (?, ?);';
                dbConn.query(addCategoryQuery, [reqBody.catname, reqBody.description], (error) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        return callback(error);
                    };
                    return callback(null);
                });
            };
        });
    }
}

module.exports = Category;