## About

This program provides the means to find the two-letter country code of the country an IP address is likely used in. The program reads in a publicly available file with definitions, and performs a binary search on them. Adjacent blocks belonging to the same country are joined, which reduces the number of items by about 50%. The binary search has to perform a maximum of 16 steps, which makes lookups extremely fast.

This is meant to be used as part of a server program, or as a standalone server. Loading in the entire datafile takes a few seconds, and is therefore not the best solution if all you need is a single lookup.

Trading memory for speed pays off, however: when running as an HTTP server, requests take less than 0.3ms on both a 2.5GHz MacBook Pro and a _Linode 768_ virtual private server. The in-memory cache requires about 8MB of real memory when running on Mac OS X in 64-bit mode node (and roughly the same in 32-bit mode on Linux). This was tested by comparing the amount of memory used by the _Hello World_ example on the [node.js website](http://nodejs.org/) with the ip2cc server invoked by the `listen()` function.

## Installation

``npm install ip2cc``

## Usage

Quick example:

```javascript
var ip2cc = require('ip2cc');

ip2cc.lookUp('174.96.192.67', function(ipaddress, country) {
	if (country) {
		console.log(ipaddress+': '+country);
	} else {
		console.log(ipaddress+' not found');
	}
});
```

### Function lookUp(ipaddress, [callback])

This function performs the lookup and calls the callback (if provided), which gets two parameters: `callback(ip, cc)`, where ip is the ipaddress the way it was passed to the function, and cc is the two-letter country code if one was found, or null if not. In addition to the typical dot-notation string, the IP address can be a string containing the IP address as a single number, or the number itself.

In addition to the asynchronous pattern, `lookUp()` can also be used synchronously: it returns the two-letter country code in any case, whether it is called with a `callback` parameter or not.

### Function listen(port)

Creates a simple server process that listens on `port` for requests and returns a simple JSON object as the response. The IP to be looked up is passed in the URL. If the server is listening on port 4711, a request to http://127.0.0.1:4711/174.96.192.67 will result in the following response:

```javascript
{
	"ip":"174.96.192.67",
	"cc":"US"
}
```

## Country Codes

The country codes returned are [two-letter ISO 3166 codes](http://en.wikipedia.org/wiki/ISO_3166), which are the same ones as used for international top-level domain names (ccTLDs); with the following exceptions, however (taken from the header of the `IpToCountry.csv` file):

* AP - non-specific Asia-Pacific location
* CS - Serbia and Montenegro
* YU - Serbia and Montenegro (Formally Yugoslavia) (Being phased out)
* EU - non-specific European Union location
* FX - France, Metropolitan
* PS - Palestinian Territory, Occupied
* UK - United Kingdom (standard says GB)

This program does not return the `ZZ` code for IETF reserved IP spaces; instead, those are reported as 'not found.' Since they are unlikely to occur, and `ZZ` would be just another special case to handle, I decided to ignore them on import (thus also slightly reducing the amount of memory used).

## Dependencies

* [Node](http://nodejs.org/)
* [node-csv-parser](https://github.com/wdavidw/node-csv-parser)
* Data file from [WEBNet77](http://software77.net/geo-ip/), included

## License

The included datafile is licensed under the [GNU General Public License, version 3 (GPLv3)](http://www.gnu.org/licenses/quick-guide-gplv3.html).

The code is licensed under the [ISC License](http://www.opensource.org/licenses/isc-license), which is practically identical to the better-known MIT License, but uses simpler wording (see below).

Copyright (c) 2011, Robert Kosara (rkosara@me.com)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.