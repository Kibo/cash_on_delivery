var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var BSON = mongo.BSONPure;
var db;
var connection_string = 'localhost:27017/postforms';

// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

MongoClient.connect('mongodb://' + connection_string, function(err, database) {
  if(err){
  	throw err;
  }    	  	
  
  db = database;
});

/**
 * Get record
 * @param {String} collection
 * @param {String} id - binary String
 * @param {Function=} callback
 * @return {Object}
 */
exports.get = function( collection, id, callback ){
	db.collection(collection, function(err, collection){		
		collection.findOne({"_id": new BSON.ObjectID(id)}, function(err, doc) {
			if(err){
  				throw err;
  			}
  			
  			// workaround for jshint	
       		var dummy = callback && callback( doc );
    	});		
	});
};

/**
 * Save object
 * @param {String} collection
 * @param {Object} obj
 * @param {Function=} callback
 */
exports.save = function( collection, obj, callback ){	
	db.collection(collection, function(err, collection){
		collection.insert( obj, function (err, doc) {
			if(err){
  				throw err;
  			}
  				
  			// workaround for jshint	
  			var dummy = callback && callback( doc );  					  	  				  											  				  				  				  				  				
		});	
	});
};

/**
 * Remove items
 * @param {String} collection
 * @param {Object} query
 * @param {Function=} callback
 */
exports.remove = function( collection, query, callback ){
		
	if( query._id ){
		query._id = new BSON.ObjectID( query._id );
	}
	
	db.collection(collection, function(err, collection){
		collection.remove( query, {w:1}, function(err, numberOfRemovedDocs){
			if(err){
  				throw err;
  			}
  			
  			// workaround for jshint	
  			var dummy = callback && callback( numberOfRemovedDocs ); 	
		});
	});	
};

/**
 * Find documents from collection
 * @param {String} collection
 * @param {Object} query
 * @param {Function} callback 
 */
exports.find = function( collection, query, callback){
	db.collection(collection, function(err, collection){
		
		collection.find(query, function(err, cursor){
			if(err){
  				throw err;
  			}
			
			// workaround for jshint	
  			var dummy = callback && callback( cursor );   			
		});								    	
	});	
};