#!/bin/bash

set -e

echo "=============================="
echo " Deploying RashidVerse"
echo "=============================="

PROJECT_DIR="/srv/www/RashidVerse"
SERVER="root@108.61.197.246"

echo ""
echo "Syncing files..."

rsync -avz --delete \
--exclude=node_modules \
--exclude=.next \
--exclude=.git \
./ $SERVER:$PROJECT_DIR/

echo ""
echo "Building on server..."

ssh $SERVER << 'EOF'

cd /srv/www/RashidVerse

npm install

npm run build

pm2 restart rashidverse

echo ""
echo "Deployment Complete!"

EOF
