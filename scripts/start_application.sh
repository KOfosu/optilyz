#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#setting hjkjkjdks
cd /apps/optilyz
npm i
pm2 delete optilyz
pm2 start npm --name optilyz -- start