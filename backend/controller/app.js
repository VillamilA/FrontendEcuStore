// Name: Andrew Poh
// Class.: DISM/2A/01
// Admin no.: 2227168

const express = require('express');
const app = express();
const fs = require('fs')
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Category = require('../models/category');
const Platform = require('../models/platform');
const Game = require('../models/game');
const Review = require('../models/review');
const Cart = require('../models/cart');


const multer = require('multer')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const verifyToken = require('../auth/verifyToken.js');


// Multer stuffs
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname); //Stores the file as "<current date>--<filename with extension>""
    },
    onError : function(err, next) {
        console.log('error', err);  
    }
});
const upload = multer({storage:storage, limits:{files:1}}) // If file size >1MB, returns an error which is handled in the API
// const upload = multer({storage:storage, limits:{fileSize:1000000, files:1}}) // If file size >1MB, returns an error which is handled in the API

// API 1: Get all users
app.get('/users/', (req, res) => {
    User.getAllUsers((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            res.status(200).send(results);
        };
    });
});

// API 2: Add new user
app.post('/users/', (req, res) => {
    var reqBody = req.body;
    User.addUser(reqBody, (error, results) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(422).send();
                return;
            } else {
                console.log(error);
                res.status(500).send();
            };
        } else {
            res.status(201).send({"userid":results.insertId});
        };
    });
});

// API 3: Get user by ID
app.get('/users/:id', (req, res) => {
    var userId = req.params.id;
    User.getUserById(userId, (error, results) => {
        if (error) {
            if (error) {
                console.log(error);
                res.status(500).send();
            };
        } else {
            if (results.length == 0) {
                res.status(404).send({Message: "Usuario no encontrado"})
            } else {
                res.status(200).send(results);
            }
        };
    });
});

// API 4: Add new category
app.post('/category/', (req, res) => {
    var reqBody = req.body;
    Category.addCategory(reqBody, (error) => {
        if (error) {
            if (error == 'ER_DUP_ENTRY') {
                res.status(422).send();
                return;
            } else {
                console.log(error);
                res.status(500).send();
            };
        } else {
            res.status(201).send();
        };
    });
});

// API 5: Add new platform
app.post('/platform/', verifyToken, (req, res) => {
    var reqBody = req.body;
    Platform.addPlatform(reqBody, (error) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(422).send();
                return;
            } else {
                console.log(error);
                res.status(500).send();
            };
        } else {
            res.status(201).send();
        };
    });
});

// API 6: Add new game
app.post('/game/', verifyToken, (req, res) => {
    var reqBody = req.body;
    Game.addGame(reqBody, (error, results) => {
        if (error) {
            console.log(error)
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(422).send();
                return;
            } else {
                console.log(error);
                res.status(500).send();
            };
        } else {
            res.status(201).send({"gameid":results});
        };
    });
});

// API 7: Get games based on platform
app.get('/game/:platform', (req, res) => {
    var platform = req.params.platform;
    Game.getGamesByPlatform(platform, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            if (results.length == 0) {
                res.status(404).send({Message: "No se encontraron juegos en esta plataforma"});
            } else {
                res.status(200).send(results);
            }
        };
    });
});

// API 8: Delete game by ID
app.delete('/game/:id', (req, res) => {
    var id = req.params.id;
    Game.deleteGame(id, (error) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            res.status(204).send();
        };
    });
});

// API 9: Update game listing
app.put('/game/:id', (req, res) => {
    var reqBody = req.body;
    var gameid = req.params.id;
    Game.updateGame(reqBody, gameid, (error) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(403).send({Message: "Error en la actualización, ya existe otro juego con este título. Seleccione un nuevo título"});
                return;
            }
            console.log(error);
            res.status(500).send();
        } else {
            res.status(204).send();
        };
    });
});

// API 10: Add new review by a user for a game
app.post('/user/:userid/game/:gameid/review/', verifyToken, (req, res) => {
    var userid = req.params.userid;
    var gameid = req.params.gameid;    
    var reqBody = req.body;
    Review.addReview(userid, gameid, reqBody, (error, results) => {
        if (error) {
            console.log(error);
            if (error.code == 'ER_NO_REFERENCED_ROW_2') {
                res.status(404).send({Message:"No se encontró ningún juego con ese ID de juego"})
                return;
            }
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(400).send();
                return;
            }
            res.status(500).send();
        } else {
            res.status(201).send({"reviewid":results.insertId});
        };
    });
});

// API 11: Get all reviews for a game
app.get('/game/:id/review', (req, res) => {
    var gameid = req.params.id;
    Review.getReviews(gameid, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            if (results.length == 0) {
                res.status(404).send({Message:"No se encontraron juegos con ese ID de juego o no se encontraron reseñas."})
                return;
            }
            res.status(200).send(results);
        };
    });
});

// API 12: Upload image for a game
app.post('/game/:gid/image', (req, res) => {
    var gameid = req.params.gid;
    upload.single("image")(req, res, (error) => { // upload is a multer thing, not a function I created
        if (req.file != undefined) {
            // if (req.file.mimetype != 'image/jpeg') {                // If file is not jpeg, send message that file upload failed
            //     res.status(403).send({Message: "Image upload failed: File must be in jpg format"});
            //     fs.unlinkSync(".\\" + req.file.path)
            // } else {
                Game.uploadGameImage(gameid, req.file.filename, (error, results) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            res.status(403).send({Message: "El juego ya tiene una imagen."})
                        }
                        fs.unlinkSync(".\\" + req.file.path)
                        console.log(error);
                        res.status(500).send();
                    } else {
                        res.status(201).send({Message: "Carga de archivo exitosa"})
                    };
                });
            // }
        } else if (error instanceof multer.MulterError) {
            if (error.code == 'LIMIT_FILE_SIZE') {              // If file size >1MB, send message that file upload failed
                res.status(403).send({Message: "Error al cargar la imagen: el tamaño del archivo debe ser inferior a 1 MB"});
            } else if (error.code == 'LIMIT_FILE_COUNT'){
                res.status(403).send({Message: "Error al cargar la imagen: solo se puede cargar 1 imagen"}); // If fmultiple files are uploaded, send message that file upload failed
            } else {
                console.log(error)
                res.status(500).send();
            }
        }
    });
});

// API 13: Get image of game
app.get('/game/:gid/image/', (req, res) => {
    var gameid = req.params.gid;
    Game.getGameImage(gameid, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            if (results[0] == undefined) {
                res.status(404).send({Message:"No hay ninguna imagen disponible para ese juego."})
            } else {
                res.status(200).sendFile(results[0].imageName, {root:'images'});

            }
        };
    });
});

// API 14: Get game information based on gameid and platformid
app.get('/game/:gid/:platformid', (req, res) => {
    var gameid = req.params.gid;
    var platformid = req.params.platformid;
    Game.getGameByID(gameid, platformid, (error, results) => {
        if (error) {
            if (error == 'El id del juego no existe') {
                res.status(404).send({Message:'Juego no encontrado'})
            } else {
                console.log(error);
                res.status(500).send();
            }
        } else {
            res.status(200).send(results);
        };
    });
});

// API 15: Log in user
app.post('/user/login', [
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password').not().isEmpty().withMessage('La contraseña no puede estar vacía')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    var reqBody = req.body;
    User.loginUser(reqBody, (error, token) => {
        if (error) {
            res.status(500).send();
        } else {
            res.status(200).send({ 'token': token });
        }
    })
})

// API 16: Get games based on filters
// app.get('/game/', (req, res) => {
//     var filters = req.query;
//     Game.getGamesByFilters(filters, (error, results) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send();
//         } else {
//             if (results.length == 0) {
//                 res.status(404).send({Message: "No games found"});
//             } else {
//                 res.status(200).send(results);
//             }
//         };
//     });
// });

app.get('/game/', (req, res) => {
    var filters = req.query;
    console.log("Filters received:", filters);

    Game.getGamesByFilters(filters, (error, results) => {
        if (error) {
            console.log("Error:", error);
            res.status(500).send();
        } else {
            if (results.length === 0) {
                res.status(404).send({ Message: "Juego no encontrado" });
            } else {
                res.status(200).send(results);
            }
        }
    });
});


// API 17: Get platforms and categories for store filterBar and for admin dropdown lists
app.get('/platformsAndCategories/', (req, res) => {
    Game.getPlatformsAndCategories((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            res.status(200).send(results);
        };
    });
});

// API 18: Verify admin
app.get('/verifyAdmin/:token', verifyToken, (req, res) => {
    var token = req.params.token;
    
    if (JSON.parse(atob(token.split('.')[1])).role != 'admin') {
        res.status(403).send();
        return;
    }
    res.status(200).send();
});

// API 19: Get cart
app.get('/cart/', (req, res) => {
    Cart.getCart((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            if (results == '0') {
                res.status(404).send();
                return;
            }
            res.status(200).send(results);
        };
    });
});

// API 20: Add to cart
app.post('/cart/', verifyToken, (req, res) => {
    Cart.addToCart(req.body, (error, results) => {
        if (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(409).send();
                return;
            }
            console.log(error);
            res.status(500).send();
        } else {
            res.status(200).send(results);
        };
    });
});

// API 21: Remove from cart
app.delete('/cart/', verifyToken, (req, res) => {
    var id = req.query.itemid;
    Cart.removeFromCart(id, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        } else {
            res.status(200).send(results);
        };
    });
});

// API 22: Add purchase to history
app.post('/purchase/', verifyToken, (req, res) => {
    Cart.purchase((error, results) => {
        if (error) {
            if (error == 404) {
                res.status(404).send();
                return;
            }
            console.log(error);
            res.status(500).send();
        } else {
            res.status(200).send(results);
        };
    });
});
module.exports = app;