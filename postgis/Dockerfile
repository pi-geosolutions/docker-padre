######################################
# PostGIS container for Padre1 instance
# Contains 2 databases : 
#  - geonetwork DB (created by geonetwork on first startup)
#  - geodata DB (postgis DB)
######################################
FROM camptocamp/postgis:9.6
MAINTAINER Jean Pommier <jean.pommier@pi-geosolutions.fr>

ENV POSTGRES_USER padre 
ENV POSTGRES_DB geodata
ADD sql/*.sql /docker-entrypoint-initdb.d/

