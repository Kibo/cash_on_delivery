var urlParser = require("url");
var fs = require( 'fs' );
var path = require( 'path' );
var T2W = require( 'numbers2words' );
var db = require( '../db/mongo_crud.js');

var COLLECTION_NAME = 'doc';

var REPREZENTATION = {
	"PREVIEW":"preview",
	"PRINT":"print",
	"DATA":"data"
};

/**
 * @controller
 * @get
 */
exports.index = function( req, res ) {		
	res.render( 'form');
};

/**
 * @api {post} /save Save
 *
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName SaveDocument
 * @apiDescription Save the document.
 *
 * @apiParamTitle (note) Important! For correct field name look at  column with name 'Description'. (ApiDoc tool does not support such field name.)
 * @apiParam (note) {String} sender_firstname sender[firstname]
 * @apiParam (note) {String} sender_lastname sende[lastname]
 * @apiParam (note) {String} sender_street sender[street]
 * @apiParam (note) {String} sender_city sender[city]
 * @apiParam (note) {String} sender_zip sender[zip]
 * @apiParam (note) {String} sender_phone sender[phone]
 * @apiParam (note) {String} sender_email sender[email]
 *
 * @apiParam (note) {String} [bank_purpose_of_payment] bank[purpose_of_payment]
 * @apiParam (note) {String} bank_account_number bank[account_number]
 * @apiParam (note) {String} bank_variable_symbol bank[variable_symbol]
 * @apiParam (note) {String} [bank_specific_symbol] bank[specific_symbol]
 * @apiParam (note) {String} [bank_constant_symbol] bank[constant_symbol]
 * @apiParam (note) {String} bank_amount_number bank[amount_number]
 *
 * @apiParam (note) {String} recipient_firstname recipient[firstname]
 * @apiParam (note) {String} recipient_lastname recipient[lastname]
 * @apiParam (note) {String} recipient_streetname recipient[streetname]
 * @apiParam (note) {String} recipient_city recipient[city]
 * @apiParam (note) {String} recipient_zip recipient[zip]
 * @apiParam (note) {String} recipient_phone recipient[phone]
 * @apiParam (note) {String} recipient_email recipient[email]
 *
 * @apiSuccess (201) Success Success and redirect.
 * @apiError (400) BadRequest Validation error.
 *
 * @apiExample CURL usage:
 * 	curl -i -X POST http://HOST/save --data 'sender%5Bfirstname%5D=Tomas&sender%5Blastname%5D=Jurman&sender%5Bstreet%5D=T%C5%99eb%C3%ADzsk%C3%A9ho+4&sender%5Bcity%5D=Znojmo&sender%5Bzip%5D=66902&sender%5Bphone%5D=728+435+724&sender%5Bemail%5D=tomasjurman%40gmail.com&bank%5Bpurpose_of_payment%5D=Spl%C3%A1tka&bank%5Baccount_number%5D=98-123456789%2F0800&bank%5Bvariable_symbol%5D=456&bank%5Bspecific_symbol%5D=123&bank%5Bconstant_symbol%5D=789&bank%5Bamount_number%5D=2289&recipient%5Bfirstname%5D=Petr&recipient%5Blastname%5D=Bundakundapakunda&recipient%5Bstreet%5D=Bolz%C3%A1nova+18&recipient%5Bcity%5D=Praha&recipient%5Bzip%5D=36958&recipient%5Bphone%5D=124+563+789&recipient%5Bemail%5D=petrbunda%40email.com&reprezentation=preview'
 */
exports.save = function(req, res){
	
	var validation = validate(req.body);			
	if( validation.result){		
		req.body.created = new Date();		
				
		var reprezentation = req.body.reprezentation || REPREZENTATION.DATA;
		delete req.body.reprezentation;
																													
		db.save(COLLECTION_NAME, req.body, function( doc ){					
			res.redirect(201, '/get/' + doc[0]._id + '/' + reprezentation);							
			return;	
		});				
	}else{	
		res.json(400, {'message': validation.messages });
		return;
	}		
};

/**
 * @api {get} /get/:id/:reprezentation? Get
 * 
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName GetDocument
 * @apiDescription Get the reprezentation of the document.
 *
 * @apiParam {String} id Document id value
 * @apiParam {String} [reprezentation=data] data | preview | print
 *
 * @apiSuccess (200) Success Get a reprezentation of the document.
 * @apiError (404) NotFound The <code>id</code> of the document was not found.
 * @apiError (400) BadRequest The request had bad syntax.
 *
 * @apiExample CURL usage:
 * 	curl -i -X GET http://HOST/get/536a4a09617b0235489842ae/preview
 */
exports.get = function( req, res ) {	
	try{						
		db.get(COLLECTION_NAME, req.params.id, function(doc){
			if(!doc){
				res.json(404, {'message': "Not Found" });
				return;																						
			}
			
			doc.reprezentation = getLastPartFromPathName(req.url);
			show(req, res, doc);				
		});	
	}catch( e ){		
		res.json(400, {'message': e.message });
		return;				
	}
};

/**
 * @api {delete} /delete/:id Delete
 *
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName DeleteDocument
 * @apiDescription Delete the document
 *
 * @apiParam {String} id Document id value
 *
 * @apiSuccess (200) Success The document has been deleted.
 * @apiError (404) NotFound The <code>id</code> of the document was not found.
 * @apiError (400) BadRequest The request had bad syntax.
 *
 * @apiExample CURL usage:
 * 	curl -i -X DELETE http://HOST/delete/536a4a09617b0235489842ae
 */
exports.del = function( req, res ){	
	try{						
		db.remove(COLLECTION_NAME, {"_id":req.params.id}, function( count ){
			if(count === 0){
				res.json(404, {'message': "Not Found"});
				return;		
			}
						
			res.json(200, {'message':'OK'});
			return;				
		});	
	}catch( e ){		
		res.json(400, {'message': e.message });
		return;				
	}	
};

/**
 * @api {get} /all All
 *
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName GetAllDocuments
 * @apiDescription Get all documents
 *
 * @apiSuccess (200) Success Get reprezentation of all documents.
 *
 * @apiExample CURL usage:
 * 	curl -i http://HOST/all
 */
exports.all = function(req, res){
	db.find(COLLECTION_NAME, {}, function( cursor ){		
		cursor.toArray(function(err, docs ){
			res.render( 'all', {'docs':docs} );
			return;
		});									
	});
};

/**
 * @api {get} /old Old
 *
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName GetOldDocuments
 * @apiDescription Get old documents
 *
 * @apiSuccess (200) Success Get reprezentation of old documents.
 *
 * @apiExample CURL usage:
 * 	curl -i http://HOST/old
 */
exports.old = function(req, res){		
	db.find(COLLECTION_NAME, {'created': {$lt:getOldTime()}}, function( cursor ){		
		cursor.toArray(function( err, docs ){
			res.render( 'all', {'docs':docs} );
			return;											
		});									
	});
};

/**
 * @api {delete} /old/delete Old_Delete
 *
 * @apiVersion 0.4.0
 * @apiGroup Document
 * @apiName DeleteOldDocuments
 * @apiDescription Delete old documents
 *
 * @apiSuccess (200) Success Delete old documents. 
 * @apiError (404) NotFound No documents.
 * @apiError (400) BadRequest The request had bad syntax.
 *
 * @apiExample CURL usage:
 * 	curl -i -X delete http://HOST/old/delete
 */
exports.deleteOld = function(req, res){	
	try{						
		db.remove(COLLECTION_NAME, {'created': {$lt:getOldTime()}}, function( count ){
			if(count === 0){
				res.json(404, {'message': "Not Found"});
				return;		
			}
						
			res.json(200, {'message':'OK'});
			return;				
		});	
	}catch( e ){		
		res.json(400, {'message': e.message });
		return;				
	}	
};

/**
 * Show document
 * @param {Object} req
 * @param {Object} res
 * @param {Object} doc
 */
function show(req, res, doc){
	switch (doc.reprezentation) {
		
		case REPREZENTATION.PREVIEW:			
			res.render( 'get', extendsData( doc ) );
			break;
				
		case REPREZENTATION.PRINT:
			res.render( 'get', extendsData( doc ) );
			break;
				
		case REPREZENTATION.DATA:
			delete doc.reprezentation;
			res.json( 200, doc);
			break;		
			
		default:		
			res.render( 'get', extendsData( doc ) );
	}
		
	return;	
}

/**
 * Get last part from pathname
 * /get/123/{LAST_PART}
 * @param {String} url
 * @return {String}
 */
function getLastPartFromPathName(url){
	
	var pathname = urlParser.parse(url, true).pathname;
	var parts = pathname.split("/");
	
	var idx = parts.length;
	while(idx--){
		if(parts[idx]){
			return parts[idx]; 
		}			
	}				
}

/**
 * Validate data
 * @param {Object} data
 * @return {Object}
 */
function validate( data ){
	
	var messages = [];
	var result = true;
	var keys = ['sender', 'recipient', 'bank'];
	for(var i = 0; i < keys.length; i++){
		
		if(!data[keys[i]]){
			messages.push(keys[i] + ' is not defined.');
			result = false;
		}
		
		for(var key in data[keys[i]]){
			if (data[keys[i]].hasOwnProperty(key)) {
				if(typeof data[keys[i]][key] !== 'string'){									
					messages.push( key + ' is not string value.');
					result = false;	
				}							
			}
		}			
	}
	
	return {				
		'obj':data,		
		'result':result,
		'messages':messages,
	};
}

/**
 * Parse data
 * @param {Object} data
 * @return {Object}
 */
function extendsData(data){
	
	if(data.bank.account_number){
		var parsed = parseAccountNumber( data.bank.account_number );		
		data.bank.account_number_prefix = pad( parsed[0], 6, '0');
		data.bank.account_number_account = pad( parsed[1], 10, '0');
		data.bank.account_number_bank_code = pad( parsed[2], 4, '0');	
	}
	
	if(data.bank.amount_number){
		data.bank.amount_number_as_text = new T2W('CS_CZ').toWords( parseInt( data.bank.amount_number, 10) );
	}
		
	data.bank.amount_number_penny = '00';
	
	data.bank.amount_number_full = pad( data.bank.amount_number, 19, '=');
	data.bank.amount_number_full_grid = pad( data.bank.amount_number, 8, '=');
	data.bank.variable_symbol_full = pad( data.bank.variable_symbol, 10, '0');
	data.bank.specific_symbol_full = pad( data.bank.specific_symbol, 10, '0');
	
	data.post = {};
	data.post.code = 116;
			
	return data;
}

/**
 * Splits account number to three parts: prefix, number, bank
 * @param {String} accountNumber
 * @return {Array} result - ['prefix', 'number', 'bank']
 */
function parseAccountNumber( accountNumber ){
		
	var number = accountNumber;
	var prefix = '';
	var bank = '';
	var splited;
	
	if(accountNumber.indexOf("-") !== -1){
		splited = accountNumber.split("-");
		prefix = splited[0];
		number = splited[1]; 
	}
	
	if(number.indexOf("/") !== -1){
		splited = number.split("/");
		number = splited[0];
		bank =  splited[1];
	}
		
	return [prefix, number, bank];		
}

/**
 * Completes string to the required length.
 * @param {string} base - the base string
 * @param {number} len - the required length of the string
 * @param {string=} chars - chars to be added
 * @param {boolean=} toRight - left or right
 * @return {string}
 */
function pad( base, len, chars, toRight){
	chars = chars || ' ';
			
	if (base.length >= len){
		return base;
	}
		
	return toRight ? 
		base + new Array(len - base.length + 1).join( chars ) : 
		new Array(len - base.length + 1).join( chars ) + base;	
}

/**
 * Get two weeks ago
 * 
 * @return {Date}
 */
function getOldTime(){
	return new Date ( new Date().getTime() - ( 14 * 24 * 60 * 60 * 1000 ));	
}

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ) {
	exports.validate = validate;
	exports.parseAccountNumber = parseAccountNumber;
	exports.pad = pad;		
	exports.getLastPartFromPathName = getLastPartFromPathName;	
}
