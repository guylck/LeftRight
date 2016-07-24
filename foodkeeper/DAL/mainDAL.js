var mongodb = require('mongodb');

var getConnectionString = function () {

	var connection_string = "";
	// if OPENSHIFT env variables are present, use the available connection info:
	if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	  	connection_string = 
			process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
			process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
			process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
			process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
			process.env.OPENSHIFT_APP_NAME;

	} else {

		// Set this due to your invironment
		connection_string = "admin:pEcD9tmkiQ5N@127.0.0.1:47946/foodkeeper";
	}

	return connection_string;
};

var bIsConnectedToDB = false;
var currentDB = null;

// This Function os the only one that able to connect to the db.
// Therefor, this is the only module thata requires 'mongodb'.
// All the functionality id accessable through the db object sent to the callback as argument.
// Other specific DAL modules should use this function.
var getDB = function (callback) {

	// Checking of need to connect
	if (!bIsConnectedToDB) {

		// Connecting to mongo
		var mongoClient = mongodb.MongoClient;
		mongoClient.connect('mongodb://'+getConnectionString(), function (err, db) {

			// Checking that there was no error
			if (err == null ) {

				// Setting connection flag
				bIsConnectedToDB = true;

				// Setting DB
				currentDB = db;

				// Calling callback
				callback(currentDB);
			} else {
				//throw "Cant connect to db. Error: " + err.message;
				console.error(err.message);
				callback(false);
			}
		});
	} else {

		// Calling callback
		callback(currentDB);
	}
}

var handleVoidActions = function (err, result, callback) {

	// Checking if there was error
	if (err) {
		console.log(err.message);
		callback(false);
	} else {
		callback(result ? true : false);
	}	
}

var MainDAL = {

	find : function (collection, query, project, callback) {

		getDB(function (db) {

			if (!db)  {

				callback(false);
			} else {

				// Getting cursor
				var cursor = db.collection(collection).find(query, project);

				if (!cursor) {
					if (callback) {

						callback(false);
					}
				} else {

					cursor.toArray(function (err, array) {

						if (err) {

							console.log(err.message);

							callback(false);
						} else {
							callback(array);
						}
					});
				}
			}
		});

	},
	insert : function (collection, object, callback) {

		getDB(function (db) {

			// Inserting
			db.collection(collection).insert(object, function (err, result) {

				handleVoidActions(err, result, callback);
			});
		});

	},
	update : function (collection, query, setObject, callback) {

		getDB(function (db) {

			db.collection(collection).update(query, setObject, function (err, result) {

				handleVoidActions(err, result, callback);
			});

		});

	},
	"delete" : function (collection, query, callback) {
		getDB(function (db) {

			db.collection(collection).delete(query, function (err, result) {

				handleVoidActions(err, result, callback);
			});

		});
	}

}

module.exports = MainDAL; 