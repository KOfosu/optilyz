#!/bin/bash

# update packages on the server
apt update -y

# Install node.js
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt install -y nodejs

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#Install pm2 module
npm install -g pm2
pm2 update

# cp /home/ubuntu/apps/valentines-payment/.env /home/ubuntu/
# sudo rm -rf /home/ubuntu/apps/valentines-payment/