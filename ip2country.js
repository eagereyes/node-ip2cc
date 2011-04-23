var csv = require('csv');

var FILENAME = 'IpToCountry.csv';

var ipList = [];

function lookUp(ipaddress, callback) {
	var address;
	if (ipaddress.indexOf('.') >= 0) {
		var bytes = ipaddress.split('.');
		address = parseInt(bytes[0], 10)*16777216 + parseInt(bytes[1], 10)*65536 +
					parseInt(bytes[2], 10)*256 + parseInt(bytes[3], 10);
	} else {
		address = parseInt(ipaddress, 10);
	}
	var bottom = 0;
	var top = ipList.length-1;
	var mid = 0;
	do {
		mid = Math.floor((bottom+top)/2);
		if (address > ipList[mid].end) {
			bottom = mid + 1;
		} else {
			top = mid - 1;
		}
	} while (!(address >= ipList[mid].start && address <= ipList[mid].end) && (top >= bottom));
	if (address >= ipList[mid].start && address <= ipList[mid].end) {
		callback(ipaddress, ipList[mid].cc);
	} else {
		callback(ipaddress, null);
	}
}

function testOut(ipaddress, country) {
	if (country) {
		console.log(ipaddress+': '+country);
	} else {
		console.log(ipaddress+' not found');
	}
}

function loadData(callback) {
	csv()
	.fromPath(FILENAME).transform(function(data) {
		if (data[0][0] != '#') {
			return data;
		} else {
			return null;
		}
	})
	.on('data', function(data, index) {
		var entry = {
			start: 	parseInt(data[0], 10),
			end: 	parseInt(data[1], 10),
			cc: 	data[4]
			};
		var previous = ipList[ipList.length-1];
		// if (ipList.length > 0 && entry.start-previous.end > 1) {
		// 	console.log('gap between '+previous.end+' and '+entry.start);
		// }
		if (ipList.length > 0 && entry.start == previous.end+1 && previous.cc == entry.cc) {
			previous.end = entry.end;
		} else {
			ipList.push(entry);
		}
	})
	.on('end', function(count) {
		console.log(count+' lines, '+ipList.length+' entries.');
		lookUp('174.96.190.61', testOut);
		lookUp('3640291329', testOut);
	})
	.on('error', function(error){
		console.error(error.message);
	});
}

loadData();

