#!/bin/env node
var activatorsDAL = require('../DAL/ActivatorsDAL.js');
var commonLogic = require('./UtilitiesBL.js');

var cache = {};

var ActivatorsManager = {

	authenticateActivator: function (activator, callback) {
		
		activatorsDAL.getActivatorByLoginData(activator, function(result) {

			commonLogic.basicCheckQueryResult(result, true, callback);
		});
	},
	
	getActivatorById: function (activatorId, callback) {
		
		activatorsDAL.getActivatorById(activatorId, function (result) {
			
			commonLogic.basicCheckQueryResult(result, true, callback);
		});
	}
};

module.exports = ActivatorsManager;