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
 * Save document
 * @api {post} /save
 * @apiVersion 0.4.0
 * @apiName SaveDocument
 * @apiGroup Document
 * 
 * @apiParam {String} sender[firstname]
 * @apiParam {String} sender[lastname]
 * @apiParam {String} sender[streetname]
 * @apiParam {String} sender[city]
 * @apiParam {String} sender[zip]
 * @apiParam {String} sender[phone]
 * @apiParam {String} sender[email]
 * 
 * @apiParam {String} bank[purpose_of_payment]
 * @apiParam {String} bank[account_number]
 * @apiParam {String} bank[variable_symbol]
 * @apiParam {String} bank[specific_symbol]
 * @apiParam {String} bank[constant_symbol]
 * @apiParam {String} bank[amount_number]
 * 
 * @apiParam {String} recipient[firstname]
 * @apiParam {String} recipient[lastname]
 * @apiParam {String} recipient[streetname]
 * @apiParam {String} recipient[city]
 * @apiParam {String} recipient[zip]
 * @apiParam {String} recipient[phone]
 * @apiParam {String} recipient[email]
 * 
 * @apiSuccess (302)
 * 
 * @apiExample Example usage:
 * 	curl -L 'http://HOST/save' --data 'sender%5Bfirstname%5D=Tomas&sender%5Blastname%5D=Jurman&sender%5Bstreet%5D=T%C5%99eb%C3%ADzsk%C3%A9ho+4&sender%5Bcity%5D=Znojmo&sender%5Bzip%5D=66902&sender%5Bphone%5D=728+435+724&sender%5Bemail%5D=tomasjurman%40gmail.com&bank%5Bpurpose_of_payment%5D=Spl%C3%A1tka&bank%5Baccount_number%5D=98-123456789%2F0800&bank%5Bvariable_symbol%5D=456&bank%5Bspecific_symbol%5D=123&bank%5Bconstant_symbol%5D=789&bank%5Bamount_number%5D=2289&recipient%5Bfirstname%5D=Petr&recipient%5Blastname%5D=Bundakundapakunda&recipient%5Bstreet%5D=Bolz%C3%A1nova+18&recipient%5Bcity%5D=Praha&recipient%5Bzip%5D=36958&recipient%5Bphone%5D=124+563+789&recipient%5Bemail%5D=petrbunda%40email.com&reprezentation=preview'
 */
exports.save = function(req, res){
	
	var validation = validate(req.body);			
	if( validation.result){		
				
		var reprezentation = req.body.reprezentation || REPREZENTATION.DATA;
		delete req.body.reprezentation;
																		
		db.save(COLLECTION_NAME, req.body, function( doc ){					
			res.redirect(302, '/get/' + doc[0]._id + '/' + reprezentation);							
			return;	
		});				
	}else{	
		res.json(400, { error: validation.messages });
		return;
	}		
};

/**
* Get reprezentation of document
* @api {get} /get/:id/:reprezentation?
* @apiVersion 0.4.0
* @apiName GetDocument
* @apiGroup Document
* 
* @apiParam {String} id
* @apiParam {String=} reprezentation - (data | preview | print)
* 
* @apiSuccess (200)
* 
* @apiExample Example usage:
* 	curl -i http://HOST/get/536a4a09617b0235489842ae/preview
*/
exports.get = function( req, res ) {	
	try{						
		db.get(COLLECTION_NAME, req.params.id, function(doc){
			if(!doc){
				res.json(404, { error: "Not Found" });
				return;																						
			}
			
			doc.reprezentation = getLastPartFromPathName(req.url);
			show(req, res, doc);				
		});	
	}catch( e ){		
		res.json(400, { error: e.message });
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
	};	
		
	return;	
};

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
		
		for(key in data[keys[i]]){
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
};

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
		data.bank.account_number_bank_code = pad( parsed[2], 4, '0');;		
	}
	
	if(data.bank.amount_number){
		data.bank.amount_number_as_text = new T2W('CS_CZ').toWords( parseInt( data.bank.amount_number, 10) );
	}
		
	data.bank.amount_number_penny = '00';
	
	data.bank.amount_number_full = pad( data.bank.amount_number, 21, '=');
	data.bank.amount_number_full_grid = pad( data.bank.amount_number, 8, '=');
	data.bank.variable_symbol_full = pad( data.bank.variable_symbol, 10, '0');
	data.bank.specific_symbol_full = pad( data.bank.specific_symbol, 10, '0');
			
	return data;
};

/**
 * Splits account number to three parts: prefix, number, bank
 * @param {String} accountNumber
 * @return {Array} result - ['prefix', 'number', 'bank']
 */
function parseAccountNumber( accountNumber ){
		
	var number = accountNumber;
	var prefix = '';
	var bank = '';
	
	if(accountNumber.indexOf("-") !== -1){
		var splited = accountNumber.split("-");
		prefix = splited[0];
		number = splited[1]; 
	}
	
	if(number.indexOf("/") !== -1){
		var splited = number.split("/");
		number = splited[0];
		bank =  splited[1];
	}
		
	return [prefix, number, bank];		
};

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
	};
		
	return toRight ? 
		base + new Array(len - base.length + 1).join( chars ) : 
		new Array(len - base.length + 1).join( chars ) + base;	
};

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ) {
	exports.validate = validate;
	exports.parseAccountNumber = parseAccountNumber;
	exports.pad = pad;		
	exports.getLastPartFromPathName = getLastPartFromPathName;	
}
