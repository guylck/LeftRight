#!/bin/env node

var commonLogic = {
	basicCheckQueryResult: function (result, isOne, callback) {

		// Cheking query result
		if (!result) {

			// Technical error
			callback(false, true);
		} else if (isOne){

			// Checking duplications
			if (result.length != 1) {
				callback(false);
			} else {

				// Continue program flow
				callback(result[0]);
			}
		} else {
			callback(result);
		}
	}
}

module.exports = commonLogic;