#!/bin/sh

# Alias this script for easier experience
# Usage:
#    ./nspr.sh on
#    ./nspr.sh off

NSPR="export NSPR_LOG_MODULES=ObserverService:5"
OPTION=$1
DISK_DEVICE=`adb shell mount | grep '/system' | awk '{ print $1 }'`
adb shell "mount -o remount,rw $DISK_DEVICE /system"
#adb pull /system/bin/b2g.sh .

#LINE2=`sed '2q;d' b2g.sh`

#if [ "$OPTION" = "on" ] && [ "$LINE2" != "$NSPR" ]; then
#  sed -i '' -e '2i' -e "$NSPR" b2g.sh
#elif [ "$OPTION" = "off" ] && [ "$LINE2" = "$NSPR" ]; then
#  sed -i '' -e '2d' b2g.sh
#fi

adb push b2g.sh /system/bin/b2g.sh
#rm b2g.sh
adb shell chmod 755 /system/bin/b2g.sh
adb shell chown root.shell /system/bin/b2g.sh
#adb reboot
