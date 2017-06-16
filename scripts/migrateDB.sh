#!/bin/bash
# Execute this as root
# Param 1 = source path
# Param 2 = destination server name or IP
# Param 3 = destination server port nb
# Param 4 = files list
display_usage() {
echo "This script must be run with super-user privileges."
echo "it copies the useful files to the new geoserver instance's datadir"
echo -e "\nUsage:\n$0 NS DEST_SERVER DEST_PORT [DATADIR_ROOT_PATH] \n"
}
# if less than two arguments supplied, display usage
if [ $# -ne 4 ]
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

DEST_SERVER=${2:-ner.pigeo.fr}
DEST_PORT=${3:-2255}


rm finishMigrateDB.sh
for file in $4; do
	cd $1
	scp -P $DEST_PORT ${file}.gz root@$DEST_SERVER:/padre/
	cd -
	echo "gunzip ${file}.gz" >> finishMigrateDB.sh
	#replace DB name to 'geodata' if this is relevant
	if [[ "$file" == *geodata ]]
	then
		echo "sed -i -E \"s|${file}|geodata|gm\" $file" >> finishMigrateDB.sh
	fi
	#replace DB name to 'geonetwork' if this is relevant
	if [[ "$file" == *gn2_10 ]]
	then
		echo "sed -i -E \"s|${file}|geonetwork|gm\" $file" >> finishMigrateDB.sh
	fi
	echo "sed -i -E \"s|fr_FR.UTF-8|en_US.UTF-8|gm\" $file" >> finishMigrateDB.sh
	echo "psql -h pgis -U padre -e < ${file}" >> finishMigrateDB.sh
done 

#apply manually geonetwork DB migration
echo "for sqlfile in geonetwork_migrate_sql/*.sql; psql -h pgis -U padre -d geonetwork < \${sqlfile}; done;" >> finishMigrateDB.sh

chmod +x finishMigrateDB.sh
scp -P $DEST_PORT finishMigrateDB.sh root@$DEST_SERVER:/padre/
scp -r -P $DEST_PORT geonetwork_migrate_sql/ root@$DEST_SERVER:/padre/

echo "transfer done. Please now ssh to the sshd container as root and execute /padre/finishMigrateDB.sh script"
