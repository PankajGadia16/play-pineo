#!/usr/bin/env bash
sudo apt update
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
# install pm2 module globaly
# npm install -g pm2
# pm2 update
