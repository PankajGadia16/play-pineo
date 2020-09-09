cd /home/ubuntu/play-pineo
sudo npm run build
# sudo pm2 start dist/src/index.js
cd frontend
sudo npm run build
sudo pm2 start node_modules/react-scripts/scripts/start.js --name "my-app"