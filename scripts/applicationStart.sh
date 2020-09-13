cd /home/ubuntu/play-pineo/backend
sudo npm run build
# sudo pm2 start dist/src/index.js
cd /home/ubuntu/play-pineo/frontend
sudo npm run build
sudo pm2 start node_modules/react-scripts/scripts/start.js --name "frontend-index"