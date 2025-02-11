// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const db = require('./databaseConfig');
const Review = {
    addReview: (userid, gameid, reqBody, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var addReviewQuery = 'INSERT INTO review (userid, gameid, content, rating) VALUES (?, ?, ?, ?);';
                dbConn.query(addReviewQuery, [userid, gameid, reqBody.content, reqBody.rating], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results);
                });
            };
        });
    },
    getReviews: (gameid, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var getReviewsQuery = `
                SELECT r.gameid, r.content, r.rating, u.username, r.created_at 
                FROM review r 
                INNER JOIN user u
                ON r.userid = u.userid
                WHERE r.gameid = ?;`;
                dbConn.query(getReviewsQuery, [gameid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results);
                });
            };
        });
    }
}

module.exports = Review;