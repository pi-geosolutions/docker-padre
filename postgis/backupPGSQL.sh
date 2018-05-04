#! /bin/bash

# backupPGSQL.sh
# by Jean Pommier <jean.pommier@pigeosolutions.fr>
# backed up files can be restored by uncompressing the file and then issueing
# 'psql -e < myfile'

DUMPALL="/usr/bin/pg_dumpall"
PGDUMP="/usr/bin/pg_dump"
PSQL="/usr/bin/psql"
HOST="localhost"
USER="postgres"
DUMP_OPTIONS=" --host=$HOST --username=$USER"
DUMPALL="$DUMPALL $DUMP_OPTIONS"
PGDUMP="$PGDUMP $DUMP_OPTIONS"
PSQL="$PSQL $DUMP_OPTIONS"

#LOGFILE=backup.log

# directory to save backups in, must be rwx by postgres user
BASE_DIR="/backups/"
YMD=$(date "+%Y-%m-%d")
#DIR="$BASE_DIR/$YMD"
DIR="$BASE_DIR"
mkdir -p $DIR
cd $DIR

LOGFILE=$BASE_DIR/backup.log

#moving old files to "old" subdirectory
#rm -rf old
#mkdir -p old
#mv *.gz old/
#mv $LOGFILE old/

# clean backup dir
rm ${BASE_DIR}/*.gz
rm ${BASE_DIR}/*.log

echo "Backup date:" > $LOGFILE
echo $(date)  >> $LOGFILE
echo "" >> $LOGFILE

# get list of databases in system , exclude the tempate dbs and empty lines (which would output as '|')
DBS=$($PSQL -l -t | awk '{print $1}'| egrep -v 'template[01]|\|')

echo "DBs:" >> $LOGFILE
echo $DBS >> $LOGFILE
echo "" >> $LOGFILE

# first dump entire postgres database, including pg_shadow etc.
# saw no use, so commented
# $DUMPALL -D | gzip -9 > "$DIR/db.out.gz"

# next dump globals (roles and tablespaces) only
#echo "$DUMPALL -g | gzip -9"
$DUMPALL -g | gzip -9 > "$DIR/globals.gz"

# now loop through each individual database and backup the schema and data separately
for database in $DBS; do
    #SCHEMA=$DIR/$database.schema.gz
    #DATA=$DIR/$database.data.gz
    DBNAME=$DIR/$database.gz


    # export data from postgres databases to plain text
    #$PGDUMP -C -c -s $database | gzip -9 > $SCHEMA

    # dump data
    #$PGDUMP -a $database | gzip -9 > $DATA

    # dump database (schema + data)
    echo "Backing up DB "$DBNAME >> $LOGFILE
    $PGDUMP -C -c $database | gzip -9 > $DBNAME
    echo "    Done ("$(date)")" >> $LOGFILE
done

echo "" >> $LOGFILE
echo "Backup terminated: "$(date) >> $LOGFILE
