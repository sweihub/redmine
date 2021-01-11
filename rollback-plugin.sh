#!/bin/bash

array=($(ls -1d plugins/*/ | sed -rn "s|plugins/([^/]+)/|\1|p"))

i=0
for T in ${array[@]}; do
	echo "$i) $T";
	((i++))
done

echo -n "> "
read N;

PLUGIN=${array[$N]}
if [ ! -z "$PLUGIN" ]; then 
	echo "rollback plugin: $PLUGIN";
	bundle exec rake redmine:plugins:migrate RAILS_ENV=production VERSION=0 NAME=$PLUGIN
fi

