gunzip ne_risques_geodata.gz
sed -i -E "s|ne_risques_geodata|geodata|gm" ne_risques_geodata
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" ne_risques_geodata
psql -h pgis -U padre -e < ne_risques_geodata
gunzip ne_risk_gn2_10.gz
sed -i -E "s|ne_risk_gn2_10|geonetwork|gm" ne_risk_gn2_10
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" ne_risk_gn2_10
psql -h pgis -U padre -e < ne_risk_gn2_10
cd geonetwork_migrate_sql/
for file in *.sql; psql -h pgis -U padre -e < ne_risk_gn2_10; done;
cd -
