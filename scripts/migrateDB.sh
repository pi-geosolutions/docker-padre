#!/bin/bash
# Execute this as root
# Param 1 = source path
# Param 2 = destination server name
# Param 3 = destination server port nb
# Param 4 = files list
# Param 5 = origin server name (e.g. ne-risk.pigeo.fr)
# Param 6 = Destination path
display_usage() {
echo "it copies the backup SQL files into the destination host, changes them as needed and prepares migration locally"
echo "You have afterwards some scripts to run on the destination host"
echo -e "\nUsage:\n$0 PGSQLBACKUPS_ROOT_PATH NS DEST_SERVER DEST_PORT\n"
}
# if less than two arguments supplied, display usage
if [ $# -lt 4 ]
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

DEST_SERVER=${2:-ne-risk.pigeosolutions.fr}
ORIG_SERVER=${5:-ne-risk.pigeo.fr}
DEST_PORT=${3:-2255}
DEST_ROOT_PATH=${6:-/padre}
PROJECT_ID=${7:-/niger}
ORIG_GN_APP_NAME=${8:-ne-risk-gn2_10}


rm migrateDB/finishMigrateDB.sh

echo "Exporting database backup files"

echo "#first drop existing tables if geonetwork has been started prior to migration"
echo "psql -h pgis -d geonetwork -U padre -e < droptables.sql" >> migrateDB/finishMigrateDB.sh

echo "echo \"Importing database backup files\" " >> migrateDB/finishMigrateDB.sh
for file in $4; do
	cd $1
	rsync -avzh -e "ssh -p $DEST_PORT -o CheckHostIP=no " ${file}.gz root@$DEST_SERVER:$DEST_ROOT_PATH/migrateDB/
	cd -
	echo "gunzip ${file}.gz" >> migrateDB/finishMigrateDB.sh
	#replace DB name to 'geodata' if this is relevant
	if [[ "$file" == *geodata ]]
	then
		echo "sed -i -E \"s|${file}|geodata|gm\" $file" >> migrateDB/finishMigrateDB.sh
	fi
	#replace DB name to 'geonetwork' if this is relevant
	if [[ "$file" == *gn2_10 ]]
	then
		echo "sed -i -E \"s|${file}|geonetwork|gm\" $file" >> migrateDB/finishMigrateDB.sh
		echo "sed -i -E \"s|${ORIG_GN_APP_NAME}|geonetwork|gm\" $file" >> migrateDB/finishMigrateDB.sh
		echo "sed -i -E \"s|geoserver-prod|geoserver|gm\" $file" >> migrateDB/finishMigrateDB.sh
		#replace all occurences of its value (origin server address)
		#to the new one (destination server address)
		echo "sed -i -E \"s|${ORIG_SERVER}|${DEST_SERVER}|gm\" $file" >> migrateDB/finishMigrateDB.sh;
	fi
	echo "sed -i -E \"s|fr_FR.UTF-8|en_US.UTF-8|gm\" $file" >> migrateDB/finishMigrateDB.sh

	#comment DROP/CREATE DB instructions
	echo "sed -i -E \"s|DROP DATABASE|--DROP DATABASE|gm\" $file" >> migrateDB/finishMigrateDB.sh
	echo "sed -i -E \"s|CREATE DATABASE|--CREATE DATABASE|gm\" $file" >> migrateDB/finishMigrateDB.sh

	echo "psql -h pgis -U padre -e < ${file}" >> migrateDB/finishMigrateDB.sh
done



echo "echo \"Copying SQL files to perform actual DB migration for geonetwork\" " >> migrateDB/finishMigrateDB.sh
#apply manually geonetwork DB migration
echo "for sqlfile in geonetwork_migrate_sql/*.sql; do psql -h pgis -U padre -d geonetwork < \${sqlfile}; done;" >> migrateDB/finishMigrateDB.sh

echo "#set project template as default view"
echo "psql -h pgis -d geonetwork -U padre -c \"UPDATE settings SET value='${PROJECT_ID}' WHERE name='system/ui/defaultView';\"" >> migrateDB/finishMigrateDB.sh

#remove superuser status from user padre
echo "psql -h pgis -U postgres -c \"ALTER USER padre WITH NOSUPERUSER;\"" >> migrateDB/finishMigrateDB.sh

echo "echo \"Migration should be complete. Please comment the 'trust' line in /var/lib/postbresql/data/pgdata/ph_hba.conf and reload the DB\" " >> migrateDB/finishMigrateDB.sh

chmod +x migrateDB/finishMigrateDB.sh
rsync -avzh -e "ssh -p $DEST_PORT -o CheckHostIP=no " migrateDB root@$DEST_SERVER:${DEST_ROOT_PATH}/

echo "transfer done. Please now ssh to the sshd container as root and execute /padre/migrateDB/finishMigrateDB.sh script"
echo "ssh -p ${DEST_PORT} root@$DEST_SERVER"
