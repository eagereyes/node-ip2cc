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

var http = require('http');
var path = require('path');
var fs = require('fs');

(function() {
	var JSONFILENAME = 'ipccdata.json';

	var ipList;

	function lookUp(ipaddress, callback) {
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
			if (callback) {
				callback(ipaddress, ipList[mid].cc);
			}
			return ipList[mid].cc;
		} else {
			if (callback) {
				callback(ipaddress, null);
			}
			return null;
		}
	}

	function listen(port) {
		http.createServer(function (req, res) {
			lookUp(req.url.substring(1), function(ip, cc) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					ip: ip,
					cc: cc
				}));
			});
		}).listen(port, '127.0.0.1');
	}

	ipList = JSON.parse(fs.readFileSync(path.join(__dirname, JSONFILENAME), 'utf8'));

	exports.lookUp = lookUp;

	exports.listen = listen;
})();