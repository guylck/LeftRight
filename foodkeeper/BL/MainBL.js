#!/bin/env node

var toExport = {
	UserManager : require('./UserManager.js'),
	PostsManager : require('./PostsManager.js'),
	ActivatorsManager: require('./ActivatorsManager.js')
};

module.exports= toExport;
