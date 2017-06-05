#!/bin/bash
# Execute this as root
# Param 1 = destination server name or IP
# Param 2 = destination server port nb
# Param 3 = (Optional) source geoserver datadir root path
display_usage() {
echo "This script must be run with super-user privileges."
echo "it copies the useful files to the new geoserver instance's datadir"
echo -e "\nUsage:\n$0 NS DEST_SERVER DEST_PORT [DATADIR_ROOT_PATH] \n"
}
# if less than two arguments supplied, display usage
if [ $# -ne 3 ]
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
DEST_SERVER=${1:-ner.pigeo.fr}
DEST_PORT=${2:-2255}
DATADIR_ROOT_PATH=${3:-/home/large/geoserver-prod-datadir}

echo "DEST_SERVER : $DEST_SERVER"
echo "DEST_PORT : $DEST_PORT"
echo "DATADIR_ROOT_PATH : $DATADIR_ROOT_PATH"


echo "Copying data files"

#Works : 
#rsync -avzh -e "ssh -p 2256" --exclude="data/metadata_subversion" --include="*" /media/jean/Backup4/serveurSYS/home/jean/tomcat7/data/gabon-mines-gn2_10-datadir/ root@ga.pigeo.fr:/padre/geonetwork_datadir/
rsync -avzh -e "ssh -p $DEST_PORT" --exclude="data/metadata_subversion" --include="*" $DATADIR_ROOT_PATH/ root@$DEST_SERVER:/padre/geonetwork_datadir/
