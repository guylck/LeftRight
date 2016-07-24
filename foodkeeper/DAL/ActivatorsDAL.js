var mainDAL 	= require('./mainDAL.js');
var ObjectID	= require('mongodb').ObjectID;

var collectionName = "Activators";

var ActivatorsDAL = {

	getActivatorByLoginData :  function (activator, callback) {
		mainDAL.find(collectionName, activator, {}, callback);
	},
	
	getActivatorById: function (activatorId, callback) {
		mainDAL.find(collectionName, {_id: new ObjectID(activatorId)}, {}, callback);
	}
};

module.exports = ActivatorsDAL;