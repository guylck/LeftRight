#!/bin/env node

var mainDAL = require('./mainDAL.js');

var collectionName = "Posts";

var postsDAL = {

	insertPost: function (post, callback) {

		mainDAL.insert(collectionName, post, callback);
	},
    
    getPosts : function (filter, callback) {
        mainDAL.find(collectionName, filter, {}, callback);
    }
};

module.exports = postsDAL   ;