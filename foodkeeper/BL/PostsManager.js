var postsDAL = require('../DAL/PostsDAL.js');
var userManager = require('./UserManager.js');
var commonLogic = require('./UtilitiesBL.js');
var activatorManager = require('./ActivatorsManager.js');

var postsManager = {

	uploadPost: function (post, user, activator, callback) {

        // Adding user id, timestamp and flags
        post.creationDate = new Date().getTime();
		post.creatingUserId = user._id;
		post.business = activator;

		postsDAL.insertPost(post, function (result) {

			// Cheking query result
			if (!result) {

				callback(false);
			} else {	

				// Continue program flow
				callback(true);
			}
		});
	},

    getPosts: function (filter, callback) {
        
        postsDAL.getPosts(filter, function (result) {
            
            commonLogic.basicCheckQueryResult(result, false, callback);
        });
	}
};

module.exports = postsManager;