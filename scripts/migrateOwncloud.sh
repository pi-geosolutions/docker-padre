#!/bin/bash
# Execute this as root
# Param 1 = source path
# Param 2 = destination server name or IP
# Param 3 = destination server port nb
# Param 4 = Destination root path
display_usage() {
echo "This script must be run with super-user privileges."
echo "it copies the useful files to the new geoserver instance's datadir"
echo -e "\nUsage:\n$0 SOURCE_PATH DEST_SERVER DEST_PORT \n"
}
# if less than two arguments supplied, display usage
if [ $# -lt 3 ]
then
display_usage
exit 1
fi
# check whether user had supplied -h or --help . If yes display usage
if [[ ( $@ == "--help") || $@ == "-h" ]]
then
display_usage
exit 0
fi

#Copy files
DATADIR_ROOT_PATH=$1
DEST_SERVER=${2:-ne-risk.pigeosolutions.fr}
DEST_PORT=${3:-2256}
DEST_ROOT_PATH=${4:-/padre}

echo "DEST_SERVER : $DEST_SERVER"
echo "DEST_PORT : $DEST_PORT"
echo "DATADIR_ROOT_PATH : $DATADIR_ROOT_PATH"


echo "Copying data directory (should suffice)"
rsync -avzh -e "ssh -p $DEST_PORT -o CheckHostIP=no" $DATADIR_ROOT_PATH root@$DEST_SERVER:${DEST_ROOT_PATH}/owncloud_data/files/


echo "Now please restart owncloud container. It should work"
