#!/bin/bash
# Rollback the plugin database change

array=($(ls -1d */ | sed 's|/$||'))

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

