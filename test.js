var ip2cc = require('./ip2cc');
var util = require('util');

function testOut(ipaddress, country) {
	if (country) {
		console.log(ipaddress+': '+country);
	} else {
		console.log(ipaddress+' not found');
	}
}

ip2cc.lookUp('174.96.192.67', function(ipaddress, country) {
	if (country) {
		console.log(ipaddress+': '+country);
	} else {
		console.log(ipaddress+' not found');
	}
});

ip2cc.lookUp('127.0.0.1', testOut);

ip2cc.lookUp('3640291329', testOut);

ip2cc.lookUp(460598268, testOut);

console.log('numeric IP 460598268 is located in '+ip2cc.lookUp(460598268));

// ip2cc.lookUp('127.0.0.1', function() {
// 	console.log(util.inspect(process.memoryUsage()));
// });

//ip2cc.listen(4711);
