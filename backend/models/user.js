// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const db = require('./databaseConfig');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../jwtConfig.js');

const User = {
    getAllUsers: (callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var getAllUsersQuery = 'SELECT * FROM user;';
                dbConn.query(getAllUsersQuery, (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results);
                });
            };
        });
    },
    addUser: (reqBody, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var addUserQuery = 'INSERT INTO user (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?);';
                dbConn.query(addUserQuery, [reqBody.username, reqBody.email, reqBody.password, reqBody.type, reqBody.profile_pic_url], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results);
                });
            };
        });
    },
    getUserById: (userId, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var getUserByIdQuery = 'SELECT * FROM user WHERE userid = ?;';
                dbConn.query(getUserByIdQuery, [userId], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results);
                });
            };
        });
    },
    loginUser: (reqBody, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null);
            }
            var sql = 'SELECT * FROM user WHERE email = ? AND password = ?;';
            conn.query(sql, [reqBody.email, reqBody.password], (err,result) => {
                conn.end();
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }
                let token = null;
                if (result.length === 1) {
                    let payload = {
                        userid: result[0].userid,
                        role: result[0].type
                    }
                    token = jwt.sign(payload, JWT_SECRET, {
                        expiresIn: 60*60*24 //24h
                    });
                }
                return callback(null, token);
            })
        })
    }
}

module.exports = User;