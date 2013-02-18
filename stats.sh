#!/bin/bash

# Mongo ID
itemId=`/bin/bash /opt/machine-system/itemid.sh`

# Memory
mem=`free -k | grep Mem | awk '{print $3-$7}'`

echo "Mem usage (KiB): $mem"

# CPU
read cpu a b c previdle rest < /proc/stat
prevtotal=$((a+b+c+previdle))
sleep 0.5
read cpu a b c idle rest < /proc/stat
total=$((a+b+c+idle))
avtotal=$(((total+prevtotal)/2))
idtotal=$(((idle+previdle)/2))
cpu=$((10000*((total-prevtotal)-(idle-previdle))/(total-prevtotal)))

echo "CPU util (hundredths of percent): $cpu"

# Disk space
disk=`df --total | grep total | awk '{print $3}'`

echo "Disk util (KiB): $disk"

# Reporting
urlString="http://visium.club.cc.cmu.edu:8080/machinesystem/server/${itemId}"

curl --request PATCH $urlString --data "mem=${mem}&cpu=${cpu}&disk=${disk}"

echo $urlString
