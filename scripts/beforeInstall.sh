#!/bin/bash

set -e

# Install node.js
# sudo apt-get install python-software-properties -y
# sudo apt-add-repository ppa:chris-lea/node.js -y
# sudo apt-get update
# sudo apt-get install nodejs -y

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

# install pm2 module globaly
# npm install -g pm2
# pm2 update
