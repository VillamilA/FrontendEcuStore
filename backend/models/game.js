// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const db = require('./databaseConfig');
const Game = {
    addGame: (reqBody, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var addGameQuery = 'INSERT INTO game (title, description, year) VALUES (?, ?, ?);';
                dbConn.query(addGameQuery, [reqBody.title, reqBody.description, reqBody.year], (error, results) => {
                    if (error) {
                        return callback(error);
                    } else {
                        var prices = reqBody.price;
                        var platformids = reqBody.platformid;
                        var categoryids = reqBody.categoryid;
                        var gameid = results.insertId;

                        var categoryQueryValues = []
                        for (let i = 0; i < categoryids.length; i++) {
                            categoryQueryValues.push([gameid,categoryids[i]])
                        }
                        var addGameToCategoryQuery = 'INSERT INTO game_and_category (gameid, categoryid) VALUES ?;';
                        dbConn.query(addGameToCategoryQuery, [categoryQueryValues], (error) => {
                            if (error) {
                                return callback(error);
                            } else {

                                for (let i = 0; i < prices.length; i++) {
                                    var addPriceQuery = 'INSERT INTO price (price, gameid, platformid) VALUES (?, ?, ?);';
                                    dbConn.query(addPriceQuery, [prices[i], gameid, platformids[i]], (error) => {
                                        if (error) {
                                            return callback(error);
                                        } else {

                                            var addGameToPlatformQuery = 'INSERT INTO game_and_platform (gameid, platformid) VALUES (?, ?);';
                                            dbConn.query(addGameToPlatformQuery, [gameid, platformids[i]], (error) => {
                                                if (i == prices.length-1) {
                                                    dbConn.end();
                                                }
                                                if (error) {
                                                    return callback(error);
                                                };
                                            });
                                        };
                                    });
                                };
                            };
                            return callback(null, gameid);
                        });
                    }
                });
            };
        });
    },
    getGamesByPlatform: (platform, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var getGamesByPlatformQuery = `
                SELECT g.gameid, g.title, g.description, price.price, p.platform_name, gc.categoryid AS catid, c.catname, g.year, g.created_at
                FROM game g 
                INNER JOIN game_and_platform gp 
                ON g.gameid = gp.gameid 
                INNER JOIN platform p
                ON gp.platformid = p.platformid
                INNER JOIN game_and_category gc
                ON g.gameid = gc.gameid
                INNER JOIN category c
                ON gc.categoryid = c.categoryid
                INNER JOIN price
                ON g.gameid = price.gameid AND price.platformid = p.platformid
                WHERE p.platform_name = ?
                ORDER BY gameid;`;
                dbConn.query(getGamesByPlatformQuery, [platform], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    // Checks for duplicate titles due to different categories, then combines the duplicates into 1 entry with all the respective categories
                    var prevResult = results[0]
                    for (let i = 1; i < results.length; i++) {
                        if (results[i].catid != String(prevResult.catid).charAt(String(prevResult.catid).length - 1)) {
                            prevResult.catid = String(prevResult.catid) + ", " + String(results[i].catid)
                            prevResult.catname = String(prevResult.catname) + ", " + String(results[i].catname)
                            results.splice(i, 1)
                        } else {
                            prevResult = results[i];
                        };
                    };

                    // Change all prices to string format for standardisation
                    results.forEach((result) => {
                        if (typeof(result.price) != "String") {
                            result.price = String(result.price);
                        };
                    });
                    return callback(null, results);
                });
            };
        });
    },
    deleteGame: (id, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err);
            } else {
                var deleteGameQuery = 'DELETE FROM game WHERE gameid = ?';
                dbConn.query(deleteGameQuery, [id], (error) => {
                    dbConn.end();
                    if (error) {
                        return callback(error);
                    };
                    return callback(null);
                });
            };
        });
    },
    updateGame: (reqBody, gameid, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err);
            } else {
                // Update game table
                var updateGameQuery = 'UPDATE game SET title = ?, description = ?, year = ? WHERE gameid = ?;';
                dbConn.query(updateGameQuery, [reqBody.title, reqBody.description, reqBody.year, gameid], (error) => {
                    if (error) {
                        return callback(error);
                    } else {
                        // Delete existing game-platform relationships from junction table
                        var deleteGameAndPlatformQuery = 'DELETE FROM game_and_platform WHERE gameid = ?;';
                        dbConn.query(deleteGameAndPlatformQuery, [gameid], (error) => {
                            if (error) {
                                return callback(error);
                            } else {
                                // Update new game-platform relationships from junction table
                                var platformids = reqBody.platformid.split(sep=",");
                                var platformQueryValues = []
                                for (let i = 0; i < platformids.length; i++) {
                                    platformQueryValues.push([platformids[i], gameid])
                                }
                                var updatePlatformQuery = 'INSERT INTO game_and_platform (platformid, gameid) VALUES ?;'; 
                                dbConn.query(updatePlatformQuery, [platformQueryValues], (error) => {
                                    if (error) {
                                        return callback(error);
                                    } else {
                                        // Delete existing game-category relationships from junction table
                                        var deleteGameAndCategoryQuery = 'DELETE FROM game_and_category WHERE gameid = ?;';
                                        dbConn.query(deleteGameAndCategoryQuery, [gameid], (error) => {
                                            if (error) {
                                                return callback(error);
                                            } else {
                                                // Update new game-category relationships from junction table
                                                var categoryids = reqBody.categoryid.split(sep=",");
                                                var categoryQueryValues = []
                                                for (let i = 0; i < categoryids.length; i++) {
                                                    categoryQueryValues.push([categoryids[i], gameid])
                                                }
                                                var updateCategoryQuery = 'INSERT INTO game_and_category (categoryid, gameid) VALUES ?;';
                                                dbConn.query(updateCategoryQuery, [categoryQueryValues], (error) => {
                                                    if (error) {
                                                        return callback(error);
                                                    } else {
                                                        // Delete existing prices for the game
                                                        var deletePriceQuery = 'DELETE FROM price WHERE gameid = ?;';
                                                        dbConn.query(deletePriceQuery, [gameid], (error) => {
                                                            if (error) {
                                                                return callback(error);
                                                            } else {
                                                                // Update new prices for the game
                                                                var prices = reqBody.price.split(sep=",");
                                                                var priceQueryValues = []
                                                                for (let i = 0; i < prices.length; i++) {
                                                                    priceQueryValues.push([prices[i], gameid, platformids[i]])
                                                                }
                                                                var updatePriceQuery = 'INSERT INTO price (price, gameid, platformid) VALUES ?;';
                                                                dbConn.query(updatePriceQuery, [priceQueryValues], (error) => {
                                                                    dbConn.end()
                                                                    if (error) {
                                                                        return callback(error);
                                                                    } else {
                                                                        return callback(null);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    };
                                                });
                                            };
                                        });
                                    };                    
                                });
                            };
                        });
                    };             
                });
            };
        });
    },
    uploadGameImage: (gameid, imageName, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var uploadGameImageQuery = 'INSERT INTO gameImage VALUES (?, ?);';
                dbConn.query(uploadGameImageQuery, [imageName, gameid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    };
                });
            };
        })); 
    },
    getGameImage: (gameid, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var getGameImageQuery = 'SELECT i.imageName FROM gameImage i, game g WHERE g.gameid = ? AND g.gameid = i.gameid;';
                dbConn.query(getGameImageQuery, [gameid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    } else {
                        return callback(null, results);
                    };
                });
            };
        })); 
    },
    getGameByID: (gameid, platformid, callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {
                var getGameQuery = `
                SELECT g.gameid, g.title, g.description, g.year, p.platform_name, p.platformid, c.catname, c.categoryid, price.price, i.imageName
                FROM game g, platform p, category c, game_and_platform gp, game_and_category gc, price, gameImage i
                WHERE g.gameid = ? AND p.platformid = ?
                    AND g.gameid = gp.gameid 
                    AND g.gameid = gc.gameid 
                    AND gp.platformid = p.platformid 
                    AND gc.categoryid = c.categoryid
                    AND g.gameid = price.gameid
                    AND gp.platformid = price.platformid
                    AND g.gameid = i.gameid;`;
                dbConn.query(getGameQuery, [gameid, platformid], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    } else {
                        if (results.length == 0) {
                            results = {Message: "No game found with that id."}
                        }
                        // Checks for duplicate titles due to different categories, then combines the duplicates into 1 entry with all the respective categories
                        var prevResult = results[0]
                        for (let i = 1; i < results.length; i++) {
                            if (results[i].categoryid != String(prevResult.categoryid).charAt(String(prevResult.categoryid).length - 1)) {
                                prevResult.categoryid = String(prevResult.categoryid) + ", " + String(results[i].categoryid)
                                prevResult.catname = String(prevResult.catname) + ", " + String(results[i].catname)
                                results.splice(i, 1)
                            } else if (results[i].platformid != String(prevResult.platformid).charAt(String(prevResult.platformid).length - 1)) {
                                prevResult.platformid = String(prevResult.platformid) + ", " + String(results[i].platformid)
                                prevResult.platform_name = String(prevResult.platform_name) + ", " + String(results[i].platform_name)
                                prevResult.price = String(prevResult.price) + ", " + String(results[i].price)
                                results.splice(i, 1)
                            }
                        };
                        if (results[0] == undefined) {
                            error = 'Game id does not exist';
                            return callback(error, null)
                        }
                        // Change all values to string format for standardisation
                        results[0].price = String(results[0].price)
                        results[0].categoryid = String(results[0].categoryid)
                        results[0].platformid = String(results[0].platformid)
                        return callback(null, results[0]);
                    };
                });
            };
        }));
    },
    getGamesByFilters: (filters, callback) => {
        var title = filters.title;
        var categories = JSON.parse(filters.category);
        var platforms = JSON.parse(filters.platform);
        var dbConn = db.getConnection();
        dbConn.connect((err) => {
            if (err) {
                return callback(err, null);
            } else {
                var getGamesByFiltersQuery = `
                SELECT g.gameid, g.title, g.description, price.price, p.platform_name, p.platformid, gc.categoryid AS catid, c.catname, g.year, g.created_at
                FROM game g 
                INNER JOIN game_and_platform gp 
                ON g.gameid = gp.gameid 
                INNER JOIN platform p
                ON gp.platformid = p.platformid
                INNER JOIN game_and_category gc
                ON g.gameid = gc.gameid
                INNER JOIN category c
                ON gc.categoryid = c.categoryid
                INNER JOIN price
                ON g.gameid = price.gameid AND price.platformid = p.platformid
                WHERE 1`;
                var filtersArray = [];
                if (title !== '') {
                    getGamesByFiltersQuery = getGamesByFiltersQuery.slice(0, -1);
                    getGamesByFiltersQuery += 'g.title LIKE ?';
                    filtersArray.push(`%${title}%`);
                } else { // the category and platform filters are only considered if there is nothing in the search bar
                    if (categories.length != 0) {
                        if (getGamesByFiltersQuery.slice(-1) == '1') { // remove the '1' if it hasnt been removed
                            getGamesByFiltersQuery = getGamesByFiltersQuery.slice(0, -1);
                        } else {
                            getGamesByFiltersQuery += ' OR';
                        }
                        for (let i = 0; i < categories.length; i++) {
                            if (i > 0) {
                                getGamesByFiltersQuery += ' OR';
                            }
                            getGamesByFiltersQuery += ' c.catname = ?';
                            filtersArray.push(categories[i])
                        }
                    }
                    if (platforms.length != 0) {
                        if (getGamesByFiltersQuery.slice(-1) == '1') { // remove the '1' if it hasnt been removed
                            getGamesByFiltersQuery = getGamesByFiltersQuery.slice(0, -1);
                        } else {
                            getGamesByFiltersQuery += ' OR';
                        }
                        for (let i = 0; i < platforms.length; i++) {
                            if (i > 0) {
                                getGamesByFiltersQuery += ' OR';
                            }
                            getGamesByFiltersQuery += ' p.platform_name = ?';
                            filtersArray.push(platforms[i])
                        }
                    }
                }
                
                dbConn.query(getGamesByFiltersQuery, filtersArray, (error, results) => {
                    dbConn.end();
                    if (error) {
                        console.log(error)
                        return callback(error, null);
                    };

                    // Convert all values to strings
                    results.forEach((result) => {
                        Object.keys(result).forEach(k => {
                            result[k] = String(result[k]);
                        });
                    })
                        
                    // Checks for duplicate titles due to different categories, then combines the duplicates into 1 entry with all the respective categories
                    var prevResult = results[0]
                    for (let i = 1; i < results.length; i++) {
                        if (prevResult.gameid == results[i].gameid && prevResult.platformid == results[i].platformid) {
                            for (let j = 0; j < prevResult.catid.split(',').length; j++ ){
                                if (prevResult.catid.split(',') != results[i].catid) {
                                    prevResult.catid += `,${results[i].catid}`
                                    prevResult.catname += `,${results[i].catname}`
                                    results.splice(i,1) // remove the result
                                    i -= 1; // go back by 1 since when you remove the result all the results will shift back by 1
                                }
                            }    
                        }
                        prevResult = results[i];
                    };

                    // Change all prices to string format for standardisation
                    results.forEach((result) => {
                        if (typeof(result.price) != "String") {
                            result.price = String(result.price);
                        };
                    });
                    return callback(null, results);
                });
            };
        });
    },
    getPlatformsAndCategories: (callback) => {
        var dbConn = db.getConnection();
        dbConn.connect((err => {
            if (err) {
                callback(err, null);
            } else {

                var sql = 'SELECT catname, categoryid FROM category;';
                dbConn.query(sql, [], (error, results) => {
                    if (error) {
                        return callback(error, null);
                    } else {

                        var categoryFilters = results;
                        var sql = 'SELECT platform_name, platformid FROM platform;'
                        dbConn.query(sql, [], (error, results) => {
                            dbConn.end();
                            if (error) {
                                return callback(error,null);
                            } else {
                                var platformFilters = results;
                                return callback(null, {'categories':categoryFilters, 'platforms':platformFilters})
                            }
                        })
                    };
                });
            };
        })); 
    },
}

module.exports = Game;