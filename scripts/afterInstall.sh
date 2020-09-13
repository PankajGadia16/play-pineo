#!/bin/bash

# for backend
cd /home/ubuntu/play-pineo/backend
sudo rm -rf .env
sudo touch .env
sudo chmod 777 .env
aws ssm get-parameters --output text --region ap-south-1 --names /env/play-pineo/backend --with-decryption --query Parameters[0].Value > .env
source .env
sudo npm install

#for frontend
cd /home/ubuntu/play-pineo/frontend
sudo rm -rf .env
sudo touch .env
sudo chmod 777 .env
aws ssm get-parameters --output text --region ap-south-1 --names /env/play-pineo/frontend --with-decryption --query Parameters[0].Value > .env
source .env
sudo npm install