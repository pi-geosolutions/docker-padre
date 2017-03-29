
PostgreSQL container for hosting the geonetwork DB: 
---------------------------------------------------

1) create a named volume to persist data : 

docker volume create --name pgdata-volume

2) Build the postgresql image (hosting the DB for geonetwork) ; 

	docker build -t padre1-pg postgresql/
	
Running an instance of this image : 

	docker run --name pg --rm  -d padre1-pg
	
3) Run an instance using the data volume :

	docker run --name pg -d --rm -e PGDATA=/var/lib/postgresql/data/pgdata -v pgdata-volume:/var/lib/postgresql/data/pgdata padre1-pg
	
Connect to it and execute commands : 

	docker exec -it pg /bin/bash
	
Geonetwork container
--------------------

1) create a named volume to persist data : 

docker volume create --name gndata-volume

2) Build the image :

	docker build -t padre1-gn geoportal/

Run a container from this image:

	docker run --name gn --link pg:pg  -p 8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork --rm padre1-gn
	(add -d if you want it as daemon)
	
3) Run using the data volume & publishing the service on port 8083: 

	docker run --name gn --link pg:pg  -p 8083:8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork -e DATA_DIR=/var/padre/geonetwork_datadir --rm  -v gndata-volume:/var/padre/geonetwork_datadir padre1-gn
	
TODO:
- more configurable Dockerfile

GeoServer container
-------------------

1) create a named volume to persist data : 

docker volume create --name gndata-volume

2) Build the image : 

	docker build -t padre1-gs geoserver/

Run a container from this image using the data volume & publishing the service on port 8082: 

docker run --name gs -p 8082:8080 --rm -v gsdata-volume:/usr/local/tomcat/webapps/ROOT/data padre1-gs


TODO
----

- customize the geoserver image : add extensions, CATALINA_OPTS, postgis database
- extend the geoserver data volume to a geospatial data volume to include all files from eumetsat etc used in animations, dashboard, etc
- add apache container to serve static files
- add User access : ssh, sftp, phppgadmin
- geodata pgsql image
- more automation
