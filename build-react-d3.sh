#!/bin/sh
# build react-d3 and upload the npm package to mobiledev-ubuntu
gulp release 
cd ..
npm pack react-d3/build/cjs/
scp react-d3-0.4.2.tgz $USER@mobiledev-ubuntu.cistec.com:/var/www/html/tar/
rm -f react-d3-0.4.2.tgz
cd -
