#!/bin/bash
aws ssm get-parameters --output text --region ap-south-1 --names /env/play-pineo --with-decryption --query Parameters[0].Value > /home/ubuntu/play-pineo/.env

cd /home/ubuntu/play-pineo
source .env
sudo npm install