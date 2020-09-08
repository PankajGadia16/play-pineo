#!/bin/bash
cd /home/ubuntu/play-pineo
rm -rf .env
touch .env
chmod 777 .env
aws ssm get-parameters --output text --region ap-south-1 --names /env/play-pineo --with-decryption --query Parameters[0].Value > .env
source .env
sudo npm install