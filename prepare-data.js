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
var path = require('path');
var fs = require('fs');

var CSVFILENAME = 'IpToCountry.csv';
var JSONFILENAME = 'ipccdata.json';

var ipList = [];

function loadData() {
	csv()
	.fromPath(path.join(__dirname, CSVFILENAME)).transform(function(data) {
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
		fs.writeFile(JSONFILENAME, JSON.stringify(ipList), function (err) {
			if (err) {
				console.error(err);
			}
		});
	})
	.on('error', function(error) {
		console.error(error.message);
	});
}

loadData();

// check for overlapping IP range blocks
for (var i = 1; i < ipList.length; i++) {
	if (ipList[i].start < ipList[i-1].end) {
		console.log('block '+ipList[i-1].start+'-'+ipList[i-1].end+'/'+ipList[i-1].cc+' contains '+ipList[i].cc);
	}
}
