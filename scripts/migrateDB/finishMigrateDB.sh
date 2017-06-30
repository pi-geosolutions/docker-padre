echo "Creating pigeosolutions users DB accounts" 
psql -h pgis -U postgres -e < createUsers.sql
echo "Importing database backup files" 
gunzip ilwac_geodata.gz
sed -i -E "s|ilwac_geodata|geodata|gm" ilwac_geodata
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" ilwac_geodata
sed -i -E "s|DROP DATABASE|--DROP DATABASE|gm" ilwac_geodata
sed -i -E "s|CREATE DATABASE|--CREATE DATABASE|gm" ilwac_geodata
psql -h pgis -U padre -e < ilwac_geodata
gunzip ml_ilwac_gn2_10.gz
sed -i -E "s|ml_ilwac_gn2_10|geonetwork|gm" ml_ilwac_gn2_10
sed -i -E "s|geoserver-prod|geoserver|gm" ml_ilwac_gn2_10
sed -i -E "s|ilwac.pigeo.fr|ml-risk.pigeosolutions.fr|gm" ml_ilwac_gn2_10
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" ml_ilwac_gn2_10
sed -i -E "s|DROP DATABASE|--DROP DATABASE|gm" ml_ilwac_gn2_10
sed -i -E "s|CREATE DATABASE|--CREATE DATABASE|gm" ml_ilwac_gn2_10
psql -h pgis -U padre -e < ml_ilwac_gn2_10
echo "Copying SQL files to perform actual DB migration for geonetwork" 
for sqlfile in geonetwork_migrate_sql/*.sql; do psql -h pgis -U padre -d geonetwork < ${sqlfile}; done;
psql -h pgis -U postgres -c "ALTER USER padre WITH NOSUPERUSER;"
echo "Migration should be complete. Please comment the 'trust' line in /var/lib/postbresql/data/pgdata/ph_hba.conf and reload the DB" 
