## About

This program provides the means to find the country an IP address is likely used in. The program reads in a publicly available file with definitions, and performs a binary search on them. Adjacent blocks belonging to the same country are joined, which reduces the number of items by about 50%. The binary search has to perform a maximum of 16 steps, which makes lookups extremely fast.

Turning this into a server should be simple, and since the data is kept in memory, it should be able to handle large numbers of requests. 

## Dependencies

* [Node](http://nodejs.org/)
* [node-csv-parser](https://github.com/wdavidw/node-csv-parser)
* Data file from [WEBNet77](http://software77.net/geo-ip/), included

## License

The included datafile is licensed under the [GNU General Public License, version 3 (GPLv3)](http://www.gnu.org/licenses/quick-guide-gplv3.html).

The code is licensed under the [ISC License](http://www.opensource.org/licenses/isc-license), which is practically identical to the better-known MIT License, but uses simpler wording (see below).

Copyright (c) 2011, Robert Kosara <rkosara@me.com>

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