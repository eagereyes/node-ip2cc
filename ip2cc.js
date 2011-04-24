//
// ip2cc.js
//
// Copyright (c) 2011, Robert Kosara <rkosara@me.com>
// 
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

var csv = require('csv');
var http = require('http');
var path = require('path');

var FILENAME = 'IpToCountry.csv';

var ipList = [];

var initialized = false;

var loading = false;

var callbacks = [];

function loadData() {
	loading = true;
	csv()
	.fromPath(path.join(__dirname, FILENAME)).transform(function(data) {
		if (data[0][0] != '#') {
			return data;
		} else {
			return null;
		}
	})
	.on('data', function(data, index) {
		if (data[4] != 'ZZ') {
			var entry = {
				start: 	parseInt(data[0], 10),
				end: 	parseInt(data[1], 10),
				cc: 	data[4]
				};
			var previous = ipList[ipList.length-1];
			if (ipList.length > 0 && entry.start == previous.end+1 && previous.cc == entry.cc) {
				previous.end = entry.end;
			} else {
				ipList.push(entry);
			}
		}
	})
	.on('end', function(count) {
		initialized = true;
		while (callbacks.length > 0) {
			callbacks.pop()();
		}
	})
	.on('error', function(error) {
		console.error(error.message);
	});
}

function ready(callback) {
	if (initialized) {
		callback();
	} else {
		callbacks.unshift(callback);
		if (!loading) {
			loadData();
		}
	}
}

function lookUp(ipaddress, callback) {
	if (!initialized) {
		ready(function() {
			lookUp(ipaddress, callback);
		});
	} else {
		var address;
		if (typeof(ipaddress) === 'number') {
			address = ipaddress;
		} else {
			if (ipaddress.indexOf('.') >= 0) {
				var bytes = ipaddress.split('.');
				address = parseInt(bytes[0], 10)*16777216 + parseInt(bytes[1], 10)*65536 +
							parseInt(bytes[2], 10)*256 + parseInt(bytes[3], 10);
			} else {
				address = parseInt(ipaddress, 10);
			}
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
}

function listen(port) {
	if (!loading) {
		loadData();
	}
	ready(function() {
		http.createServer(function (req, res) {
			lookUp(req.url.substring(1), function(ip, cc) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					ip: ip,
					cc: cc
				}));
			});
		}).listen(port, '127.0.0.1');
	});
}

exports.lookUp = lookUp;

exports.listen = listen;
