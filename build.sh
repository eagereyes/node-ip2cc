#!/bin/bash

wget http://software77.net/geo-ip/?DL=1 -O IpToCountry.csv.gz
rm IpToCountry.csv
gunzip IpToCountry.csv.gz
node prepare-data.js