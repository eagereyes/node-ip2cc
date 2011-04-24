var ip2cc = require('./ip2cc');

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

//ip2cc.listen(4711);
