#!/bin/bash
cd ~/apps/optilyz

pm2 delete optilyz
pm2 start npm --name optilyz -- start