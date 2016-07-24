#!/bin/env node
var UsersDAL = require('../DAL/UsersDAL.js');
var commonLogic = require('./UtilitiesBL.js');

var cache = {};

var UserManager = {

	getUserByToken : function(token, callback) {
		
		UsersDAL.getUserByToken(token, function (result) {
			commonLogic.basicCheckQueryResult(result, true, callback);
		});
	},

	signUpUser : function(user, callback) {

		// Checking is email already exists
		UsersDAL.getUserByEmail(user.email, function (result){

			// Reading email
			commonLogic.basicCheckQueryResult(result, true, function (result) {

				if (result) {

					// TODO : encrypt password
					UsersDAL.insertUser(user, callback);
				}
			});	
		});
		
	},

	signInUser : function(email, password, callback) {

		UsersDAL.getUserByLoginData(email, password, function authenticate(result) {

			commonLogic.basicCheckQueryResult(result, true, function (result) {
				
				if (result) {

					// Putting current user on cache
					cache.currentUser = result;
				}

				// Continue flow
				callback(result);
			});
		});
	}
};

module.exports = UserManager;