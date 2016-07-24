#!/bin/env node

var mainDAL = require('./mainDAL.js');
var jwt     = require("jsonwebtoken");

var collectionName = "Application-Users";

var UsersDAL = {

	// Insert user to db
	insertUser : function (user, callback) {

		// Generating token
		user.token = jwt.sign(user, "process.env.JWT_SECRET"); // TODO: figure out

		mainDAL.insert(collectionName, user, function () {
			callback(user.token);
		});
	},	

	// Get user by email and password
	getUserByLoginData : function (email, password, callback) {

		mainDAL.find(collectionName, {email : email, password : password}, {password : 0}, callback);
	},

	getUserByEmail : function (email, callback) {
		mainDAL.find(collectionName, {email : email}, {password : 0}, callback);
	},

	getUserByToken : function (token, callback) {
		mainDAL.find(collectionName, {"token" : token}, {}, callback);
	}
}

module.exports = UsersDAL;