#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#cp /home/ubuntu/.env /home/ubuntu/apps/valentines-payment/
#sudo apt install npm -y
#npm install -g @nestjs/cli

cd /var/www/apps/optilyz
npm i
pm2 delete optilyz
pm2 start npm --name optilyz -- start