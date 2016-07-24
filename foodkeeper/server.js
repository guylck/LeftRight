#!/bin/env node
//  OpenShift sample Node application
var express     = require('express');
var fs          = require('fs');
var bl          = require('./BL/MainBL.js');
var ObjectID	= require('mongodb').ObjectID;

var MY_IP = "10.0.0.3";


/**
 *  Define the sample application.
 */
var FoodKeeperServer = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using ' + MY_IP);
            self.ipaddress = MY_IP;
        }
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routesGet = { };
        self.routesPost = {};

        //////////
        // GET
        //////////
        self.routesGet['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routesGet['/'] = function(req, res) {
            res.send(JSON.stringify({error: "no route"}));
        };

        self.routesPost['/test'] = function(req, res) {
            res.send(JSON.stringify({error: "no route"}));
        };

    };

    self.allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         
        next();
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();
        self.app.all('/', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET, POST');
            res.header('Access-Control-Allow-Methodsol-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            next();
        });

        //////////
        // GET
        //////////
        self.app.get('/api/wall', ensureAuthorized, function (request, response) {
            
            bl.PostsManager.getPosts(request.query.filter ? JSON.parse(request.query.filter) : null, function (queryResult, wasError) {
                response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });
        
        self.app.get('/api/getPostsOfActivator', ensureAuthorized, function (request, response) {
            
            var activatorId = request.query.activatorId;
            
            bl.PostsManager.getPosts({"business._id": new ObjectID(activatorId)}, function (queryResult, wasError) {
                response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });
        
        // This route should be used after the activator was authenticated
        self.app.get('/api/getActivatorById', ensureAuthorized, function (request, response) {
            
            var activatorId = request.query.activatorId;
            
            // Checkoing if activator exists on the request
            if (request.activator && request.activator._id == activatorId) {
                response.send(JSON.stringify({result : request.activator, wasError : false}));
            } else {
                response.send(JSON.stringify({result : false, wasError : false}));
            }
        });


        //////////
        // POST
        //////////
        self.app.post('/api/authActivator', ensureAuthorized, function (request, response) {

            bl.ActivatorsManager.authenticateActivator(JSON.parse(request.query.activator), function (queryResult, wasError) {
                response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });

        self.app.post('/api/signUp', function (request, response) {

            bl.UserManager.signUpUser(JSON.parse(request.query.user), function (queryResult, wasError) {
                response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });

        self.app.post('/api/signIn', function (request, response) {

            bl.UserManager.signInUser(
                request.query.email, request.query.password, function (queryResult, wasError) {
                    response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });

        self.app.post('/api/uploadPost', ensureAuthorized, function (request, response) {

            bl.PostsManager.uploadPost(JSON.parse(request.query.post), 
                                       request.user, 
                                       request.activator, 
            function (queryResult, wasError) {
                response.send(JSON.stringify({result : queryResult, wasError: wasError}));
            });
        });
    };

    var ensureAuthorized = function (req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            activatorToken = bearer[2];

            // Checking that user exists
            bl.UserManager.getUserByToken(bearerToken, function (result) {

                if (!result) {
                    res.send(403);
                } else {
                    req.user = bearerToken;
                    
                    // Checking if there is activator token on the request
                    if (activatorToken && activatorToken !== "undefined" && activatorToken !== "") {
                        
                        // Checking that activator valid
                        bl.ActivatorsManager.getActivatorById(activatorToken, function (activatorResult) {
                            
                            if (!activatorResult) {
                                res.send(403);
                            } else {
                            
                                req.activator = activatorResult;
                                next();    
                            }
                                 
                        });
                    } else {
                        next();
                    }
                }
            });
        } else {
            res.send(403);
        }
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        //self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new FoodKeeperServer();
zapp.initialize();
zapp.start();

