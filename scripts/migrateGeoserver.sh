#!/bin/bash
# Execute this as root
# Param 1 = namespace (e.g. 'ne')
# Param 2 = destination server name or IP
# Param 3 = destination server port nb
# Param 4 = (Optional) source geoserver datadir root path
display_usage() {
echo "This script must be run with super-user privileges."
echo "it copies the useful files to the new geoserver instance's datadir"
echo -e "\nUsage:\n$0 NS DEST_SERVER DEST_PORT [DATADIR_ROOT_PATH] \n"
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
NS=${1:-ne}
DEST_SERVER=${2:-ner.pigeo.fr}
DEST_PORT=${3:-2255}
DATADIR_ROOT_PATH=${4:-/home/large/geoserver-prod-datadir}

echo "NS : $NS"
echo "DEST_SERVER : $DEST_SERVER"
echo "DEST_PORT : $DEST_PORT"
echo "DATADIR_ROOT_PATH : $DATADIR_ROOT_PATH"


echo "Copying data files"
#if in data/ root
if [ -d "$DATADIR_ROOT_PATH/data/$NS" ]; then
	rsync -avzh -e "ssh -p $DEST_PORT" $DATADIR_ROOT_PATH/data/$NS root@$DEST_SERVER:/padre/geoserver_data/data/
fi

#if in pays subfolder
if [ -d "$DATADIR_ROOT_PATH/data/pays/$NS" ]; then
	#create folder pays (rsync would, otherwise, issue an error)
	rsync -avzh -e "ssh -p $DEST_PORT" --include="pays/" --exclude="**"  $DATADIR_ROOT_PATH/data/pays root@ga.pigeo.fr:/padre/geoserver_data/data/
	rsync -avzh -e "ssh -p $DEST_PORT" $DATADIR_ROOT_PATH/data/pays/$NS root@$DEST_SERVER:/padre/geoserver_data/data/pays/
fi


echo "Copying global & matching style files (the ones starting with  ${NS}_"
rsync -avzh -e "ssh -p $DEST_PORT" --include="*" --include="${NS}_*" --exclude="??_*" $DATADIR_ROOT_PATH/styles/ root@$DEST_SERVER:/padre/geoserver_data/styles/

echo "Copying workspace ${NS}"
rsync -avzh -e "ssh -p $DEST_PORT" $DATADIR_ROOT_PATH/workspaces/$NS root@$DEST_SERVER:/padre/geoserver_data/workspaces/
