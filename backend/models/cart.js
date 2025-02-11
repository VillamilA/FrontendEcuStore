const db = require('./databaseConfig');
const Cart = {
    getCart: (callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var sql = 'SELECT * FROM cart;';
                dbConn.query(sql, [], (error, results1) => {
                    if (error) {
                        return callback(error, null);
                    } else {
                        if (results1.length == 0) {
                            return callback(null, '0')
                        }
                        for (let i = 0; i < results1.length; i++) {
                            var sql = 'SELECT title FROM game WHERE gameid = ?;';
                            dbConn.query(sql, [results1[i].gameid], (error, title) => {
                                if (error) {
                                    return callback(error, null);
                                } else {
                                    results1[i].title = title[0].title;
                                    var sql = 'SELECT platform_name FROM platform WHERE platformid = ?;';
                                    dbConn.query(sql, [results1[i].platformid], (error, platform_name) => {
                                        if (error) {
                                            dbConn.end();
                                            return callback(error, null)
                                        } else {
                                            results1[i].platform = platform_name[0].platform_name;
                                            if (i == results1.length - 1) {
                                                dbConn.end();
                                                return callback(null, results1)
                                            }
                                        }
                                    })
                                }
                            })
                        }       
                    };
                });
            };
        })); 
    },
    addToCart: (req, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var sql = 'INSERT INTO cart (userid, gameid, platformid, price) VALUES (?, ?, ?, ?);';
                dbConn.query(sql, [req.userid, req.gameid, req.platformid, req.price], (error) => {
                    dbConn.end();
                    if (error) {
                        return callback(error);
                    } else {
                        return callback(null);
                    };
                });
            };
        })); 
    },
    removeFromCart: (id, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (id == undefined) {
                sql = 'DELETE FROM cart'
            } else {
                var sql = 'DELETE FROM cart WHERE id = ?;';
            }
            if (err) {
                callback(err, null);
            } else {
                dbConn.query(sql, [id], (error) => {
                    dbConn.end();
                    if (error) {
                        return callback(error);
                    } else {
                        return callback(null);
                    };
                });
            };
        })); 
    },
    purchase: (callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var sql = 'SELECT * FROM cart;';
                dbConn.query(sql, (error, results) => {
                    if (error) {
                        return callback(error);
                    } else {
                        if (results.length == 0) {
                            dbConn.end();
                            error = 404
                            return callback(error)
                        }
                        for (let i = 0; i < results.length; i++) {
                            var sql = 'INSERT INTO purchase (userid, gameid, platformid, price) VALUES (?, ?, ?, ?);'
                            dbConn.query(sql, [results[i].userid, results[i].gameid, results[i].platformid, results[i].price], (error) => {
                                if (error) {
                                    dbConn.end();
                                    return callback(error);
                                } else {
                                    if (i == results.length -1) {
                                        var sql = 'DELETE FROM cart;';
                                        dbConn.query(sql, [], (error) => {
                                            dbConn.end();
                                            if (error) {
                                                return callback(error)
                                            } else {
                                                return callback(null);
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    };
                });
            };
        })); 
    }
}

module.exports = Cart;