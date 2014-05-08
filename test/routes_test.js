var routes = require('../routes/index.js');

exports.validate = function (test) {
	var data1 = {};
	var data2 = {sender:{}, recipient:{}, bank:{account_number:123}};
	var data3 = {sender:{}, recipient:{}, bank:{account_number:'98-123456789/100'}};
			
    test.deepEqual( routes.validate(data1), {				
		'obj':data1,		
		'result':false,
		'messages':[ 'sender is not defined.', 'recipient is not defined.', 'bank is not defined.']
	});
	
	test.deepEqual( routes.validate(data2), {				
		'obj':data2,		
		'result':false,
		'messages':['account_number is not string value.']
	});
	
	test.deepEqual( routes.validate(data3), {			
		'obj':data3,		
		'result':true,
		'messages':[]
	});
	
    test.done();
};

exports.parseAccountNumber = function (test) {	
	test.deepEqual( routes.parseAccountNumber('123456789/0100'), ['', '123456789', '0100']);
	test.deepEqual( routes.parseAccountNumber('98-123456789'), ['98', '123456789', '']);
    test.deepEqual( routes.parseAccountNumber('98-123456789/0100'), ['98', '123456789', '0100']);
    test.done();
};

exports.pad = function (test) {	
	test.equal( routes.pad('123', 10, '-', false ), '-------123');
	test.equal( routes.pad('123', 10, '-', true ), '123-------');
	test.equal( routes.pad('1', 5, '*'), '****1');
	test.equal( routes.pad('1234', 5, 'abc'), 'abc1234');
    test.done();
};

exports.getLastPartFromPathName = function (test) {
	test.equal( routes.getLastPartFromPathName('http://localhost:8000/get/536a3ce22e66135e41998adb/preview'), 'preview');
	test.equal( routes.getLastPartFromPathName('preview'), 'preview');
	test.equal( routes.getLastPartFromPathName('/preview/abc/'), 'abc');
	test.equal( routes.getLastPartFromPathName('/preview///////'), 'preview');
    test.done();	
};
