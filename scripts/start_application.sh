#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/ubuntu/apps/valentines-payment/
npm i
pm2 delete payment
pm2 start npm --name payment -- start