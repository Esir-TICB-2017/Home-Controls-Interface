// =====================================================================
// BASE SETUP ==========================================================
// =====================================================================
// call the packages we need
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model
var Room = require('./app/models/room');
var Object = require('./app/models/object');
var Sensor = require('./app/models/sensor');
var Scenario = require('./app/models/scenario');
var session = require('express-session');
var request = require("request");
app.use('/bower_components', express.static(__dirname + '/bower_components')); //supplies folder
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/publicViews', express.static(__dirname + '/app/publicViews'));
app.use('/img', express.static(__dirname + '/app/img'));
app.use('/views', express.static(__dirname + '/app/views'));
app.use('/css', express.static(__dirname + '/app/css'));
// =====================================================================
// configuration =======================================================
// =====================================================================
var port = process.env.PORT || 1337; // Port du serveur
//-----Permet de vérifier la connexion à la base de données------
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect(config.database); // Connexion à la base de données (URI dans le fichier config.js)
//----------------------------------------------------------------
app.set('superSecret', config.secret); //secret variable
app.use(morgan('dev')); // permet d'afficher les requêtes dans la console
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var Grant = require('grant-express'),
    grant = new Grant(require('./config.json'))
app.use(session({
    secret: 'very secret'
}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(grant);
app.get('/handle_facebook_callback', function(req, res, next) {
        console.log(req.query);
        res.sendFile('index.html', {
            root: __dirname
        });
        //res.end(JSON.stringify(req.query, null, 2))
    })
    // var oauth2 = require('simple-oauth2')({
    //   clientID: '103743310033763',
    //   clientSecret: '16b49321f42f95dbe90583ce885f6dea',
    //   site: 'https://www.facebook.com/',
    //   tokenPath: '/oauth/access_token',
    //   authorizationPath: 'dialog/oauth'
    // });
    // // Authorization uri definition
    // var authorization_uri = oauth2.authCode.authorizeURL({
    //   redirect_uri: 'http://localhost:1337/callback',
    //   scope: 'public_profile,email',
    //   state: '3(#0/!~'
    // });
    // // Initial page redirecting to Github
    // app.get('/auth', function (req, res) {
    //     res.redirect(authorization_uri);
    // });
    // // Callback service parsing the authorization token and asking for the access token
    // app.get('/callback', function (req, res) {
    //   var code = req.query.code;
    //   oauth2.authCode.getToken({
    //     code: code,
    //     redirect_uri: 'http://localhost:1337/callback'
    //   }, saveToken);
    //   function saveToken(error, result) {
    //     if (error) { console.log('Access Token Error', error.message); }
    //     token = oauth2.accessToken.create(result);
    //   }
    // });
    // =====================================================================
    // routes ==============================================================
    // =====================================================================
    // API ROUTES -------------------
    // ---------------------------------------------------------
    // get an instance of the router for api routes
    // ---------------------------------------------------------
    /*
    Route to get all objects in database (http://localhost:8080/api/getObjects)
    No parameters in
    Return all the objects in database (Json format)
     */
app.post('/login', function(req, res) {
    // find the user
    User.findOne({ //On cherche l'utilisateur en utilisant mongoose
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        //On regarde si l'utilisateur existe
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // Si l'utilisateur existe, on check son mot de passe
            if (user.password != req.body.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // Si on a trouvé l'utilisateur et que son mot de passe est correct : 
                // on créé un token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 3600 // Expire dans 24h
                });
                console.log('here is the token' + token);
                // return the information including token as JSON
                res.json({
                    user: user,
                    success: true,
                    message: 'Logged ! ' + 'hello ' + req.body.username,
                    token: token
                });
            }
        }
    });
});
app.all('/', function(req, res, next) {
    res.sendFile('index.html', {
        root: __dirname
    });
});
// app.use(function(req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
//     // decode token
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//             if (err) {
//                 return res.json({
//                     success: false,
//                     message: 'Failed to authenticate token.'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         // if there is no token
//         // return an error
//         return res.status(401).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });
app.get('/getObjects', function(req, res, next) {
        //retrieve all Rooms from Monogo
        mongoose.model('Object').find({}, function(err, objects) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    json: function() {
                        res.json(objects);
                    }
                });
            }
        });
    })
    /*
    Route to get one object in database (http://localhost:8080/api/getOneObject/:id)
    parameter = ':id' : find the object with its id 
    Return the object querried (Json format)
    */
app.get('/getOneObject/:id', function(req, res, next) {
        console.log(req.params.id);
        var objectId = req.params.id;
        mongoose.model('Object').find({
            _id: objectId
        }, function(err, object) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    json: function() {
                        res.json(object);
                    }
                });
            }
        });
    })
    /*
    Route add object in database (http://localhost:8080/api/setObject)
    parameter = 'name' : create an new object with its name
    Return an error if the object already exist in database
    Return the object created (Json format)
     */
app.post('/setObject', function(req, res) {
    console.log(req.body);
    var query = {
        name: req.body.name
    };
    var myObj = new Object({
        name: req.body.name
    });
    console.log(myObj);
    Object.findOneAndUpdate(query, myObj, {
        upsert: true
    }, function(err, doc) {
        if (err) {
            return res.send(500, {
                error: err
            });
        } else {
            res.format({
                //JSON response will show the newly created blob
                json: function() {
                    res.json(myObj);
                }
            });
        }
    });
});
/*
Route to delete an object in database (http://localhost:8080/api/deleteObject)
parameter = 'id' : object id
Return an error if the object is not in database
Return a Json with the deleted object and a console message
 */
app.delete('/deleteObject', function(req, res) {
    var objectId = req.body.objectId;
    //find blob by ID
    mongoose.model('Object').findById(objectId, function(err, object) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            object.remove(function(err, object) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + object._id);
                    res.format({
                        //JSON returns the item with the message that is has been deleted
                        json: function() {
                            res.json({
                                message: 'deleted',
                                item: object
                            });
                        }
                    });
                }
            });
        }
    });
});
/*
Route to get all rooms in database (http://localhost:8080/api/getRoom)
No parameters in
Return all the rooms in database (Json format)
 */
app.get('/getRooms', function(req, res, next) {
        //retrieve all Rooms from Monogo
        mongoose.model('Room').find({}, function(err, rooms) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    json: function() {
                        res.json(rooms);
                    }
                });
            }
        });
    })
    /*
    Route to get one room in database (http://localhost:8080/api/getOneRoom/:id)
    parameter = ':id' : find the room with its id 
    Return the room querried (Json format)
    */
app.get('/getOneRoom/:id', function(req, res, next) {
        var roomId = req.params.id;
        mongoose.model('Room').find({
            _id: roomId
        }, function(err, room) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    json: function() {
                        res.json(room);
                    }
                });
            }
        });
    })
    /*
    Route to add room in database (http://localhost:8080/api/setRoom)
    parameter = 'name' : create an new room with its name
    Return an error if the room already exist in database
    Return the room created (Json format)
     */
app.post('/setRoom', function(req, res) {
    var query = {
        name: req.body.name
    };
    var myObj = new Room({
        name: req.body.name
    });
    Room.findOneAndUpdate(query, myObj, {
        upsert: true
    }, function(err, doc) {
        if (err) {
            return res.send(500, {
                error: err
            });
        } else {
            res.format({
                //JSON response will show the newly created blob
                json: function() {
                    res.json(myObj);
                }
            });
        }
    });
});
/*
Route to delete a room in database (http://localhost:8080/api/deleteRoom)
parameter = 'id' : room id
Return an error if the room is not in database
Return a Json with the deleted room and a console message

!!!!TODO : Verify Delete room object reference if the deleted room is referenced in the object
 */
app.delete('/deleteRoom', function(req, res) {
    var roomId = req.body.roomId;
    //find blob by ID
    mongoose.model('Room').findById(roomId, function(err, room) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            Room.remove({
                _id: room._id
            }, function(err, room) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + room._id);
                    res.format({
                        //JSON returns the item with the message that is has been deleted
                        json: function() {
                            res.json({
                                message: 'deleted',
                                item: room
                            });
                        }
                    });
                }
            });
        }
    });
});
app.post('/deleteRoomFromObject', function(req, res) {
    var roomId = req.body.roomId;
    var objectId = req.body.objectId;
    Object.update({
        _id: objectId
    }, {
        $pull: {
            'rooms': {}
        }
    }, function(err, log) {
        if (err) {
            res.send("There was a problem updating the information to the database: " + err);
        } else {
            mongoose.model('Object').find({
                _id: objectId
            }, function(err, object) {
                if (err) {
                    return console.error(err);
                } else {
                    //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                    res.format({
                        json: function() {
                            res.json(object);
                        }
                    });
                }
            });
        }
    });
});
app.put('/addObjectToRoom', function(req, res) {
    var objectId = req.body.objectId;
    var roomId = req.body.roomId;
    Room.findOne({
        _id: roomId
    }, function(err, room) {
        console.log(room);
        Object.update({
            _id: objectId
        }, {
            $push: {
                'rooms': {
                    room: room
                }
            }
        }, function(err, log) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                mongoose.model('Object').find({
                    _id: objectId
                }, function(err, objects) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                        res.format({
                            json: function() {
                                res.json(objects);
                            }
                        });
                    }
                });
            }
        });
    });
});
/*
Route to get one room in database (http://localhost:1337/getSensors) 
Return the sensors querried (Json format)
*/
app.get('/getSensors', function(req, res, next) {
        //retrieve all Sensors from Mongo
        mongoose.model('Sensor').find({}, function(err, objects) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses requires 'Accept : application/json;' in the request header
                res.format({
                    json: function() {
                        res.json(objects);
                    }
                });
            }
        });
    })
    /*
    Route to get one room in database (http://localhost:1337/getScenario) 
    Return the sensors querried (Json format)
    */
app.get('/getScenarios', function(req, res, next) {
        //retrieve all Scenarios from Mongo
        mongoose.model('Scenario').find({}, function(err, objects) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses requires 'Accept : application/json;' in the request header
                res.format({
                    json: function() {
                        res.json(objects);
                    }
                });
            }
        });
    })
    /*
    Route to add scenario in database (http://localhost:1337/saveScenario)
    parameter = 
    'name' : create an new room with its name
    'onTop' : used to display the scenario 
    'orderProp' : number used to display the scenario in the right order
    'autorization' : criteria that is used to know who can use and modify the scenario
    'objects' : objects controlled by the scenario and their parameters
    'sensors' : sensors selected to create conditions for auto-launching
    'conditions' : conditions for auto-lauching
    'active' : boolean
    'sensorsListForConditions' : a list of the conditions used by the interface
    Return an error if the room already exist in database
    Return the room created (Json format)
     */
app.post('/saveScenario', function(req, res) {
    var query = {
        name: req.body.name
    };
    var myObj = new Scenario({
        name: req.body.name,
        onTop: req.body.onTop,
        orderProp: req.body.orderProp,
        autorization: req.body.autorization,
        active: req.body.active,
        objects: req.body.objects
    });
    if (req.body.conditions != '') {
        myObj.conditions = req.body.conditions;
    }
    Scenario.findOneAndUpdate(query, myObj, {
        upsert: true
    }, function(err, doc) {
        if (err) {
            return res.send(500, {
                error: err
            });
        } else {
            res.format({
                //JSON response will show the newly created blob
                json: function() {
                    res.json(myObj);
                }
            });
        }
    });
});
/*
app.post('/addObjectToScenario', function(req,res){
    let objectId = req.body.id;
    let scenarioId = req.body.scenarioId;
});

app.post('/addSensorToScenario', function(req,res){
    //To do
});

app.post('/addSensorListForConditionsToScenario', function(req,res){
    //To do
});
*/
//route middleware to verify a token
app.use('/views', express.static(__dirname + '/views'));

function isAuthenticated(req, res, next) {
    if (req.user.authenticated) return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}
// route pour s'enregistrer
app.post('/signin', function(req, res) {
    User.findOne({
        username: req.body.username,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
                var userModel = new User();
                userModel.username = req.body.username;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign(user, app.get('superSecret'));
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});
// route to show a random message (GET http://localhost:8080/api/)
app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the coolest API on earth!'
    });
});
app.get('view/login.html', function(req, res) {
    res.json({
        message: 'Welcome to the coolest API on earth!'
    });
});
// route to return all users (GET http://localhost:8080/api/users)
app.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});
app.post('/uploadjson/listepieces.json', function(req, res) {
    console.log(req.body);
});
http.listen(1337, function() {
    console.log('OK');
});