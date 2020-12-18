#!/bin/sh
mkdir -p tmp tmp/pdf public/plugin_assets
sudo chown -R redmine:redmine files log tmp public/plugin_assets
sudo chmod -R 755 files log tmp public/plugin_assets
sudo find files log tmp public/plugin_assets -type f -exec chmod -x {} +
