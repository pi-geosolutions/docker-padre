#drop last line
sed -i '$ d' $PGDATA/pg_hba.conf
#and replace it by
echo "#Comment this line and reload the DB before putting it into production" >> "$PGDATA/pg_hba.conf"
echo "host 	all 	padre,postgres 	10.42.0.0/16 	trust" >> "$PGDATA/pg_hba.conf"
echo "host 	all 	padre,collect 	10.42.0.0/16 	reject" >> "$PGDATA/pg_hba.conf"
echo "host 	all 	all 			10.42.0.0/16 	md5" >> "$PGDATA/pg_hba.conf"

#echo "#Comment this line and reload the DB before putting it into production" >> "$PGDATA/pg_hba.conf"
#echo "host 	all 	padre,postgres 	172.17.0.0/16 	trust" >> "$PGDATA/pg_hba.conf"
#echo "host 	all 	padre,collect 	172.17.0.0/16 	reject" >> "$PGDATA/pg_hba.conf"
#echo "host 	all 	all 			172.17.0.0/16 	md5" >> "$PGDATA/pg_hba.conf"

echo "reloading pg_ctl after pg_hba modifs"
pg_ctl restart -D "$PGDATA" -m fast -w
