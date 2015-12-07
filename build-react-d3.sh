#!/bin/sh
# build react-d3 and upload the npm package to mobiledev-ubuntu
cd react-d3     # git folder of react-d3
gulp release 
cd ..
npm pack react-d3/build/cjs/
scp react-d3-0.4.1.tgz $USER@mobiledev-ubuntu.cistec.com:/var/www/html/tar/
