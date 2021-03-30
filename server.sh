#!/bin/sh
DIR=$(dirname "$0")
cd $DIR
nohup bundle exec rails server webrick -e production -p 80 >/dev/null 2>&1 &
