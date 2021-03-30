#!/bin/sh
PID=`ps -Af | grep "bin/rails server webrick -e production -p 80" | grep -v grep | awk '{print $2}'`

if [ ! -z "$PID" ]; then
	echo "kill redmine: $PID"
	kill $PID;
	sleep 1
fi

echo "restart redmine"
./server.sh
