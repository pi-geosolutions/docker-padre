Data container
--------------
Build the data image:

	$ docker build -t padre1-data .
	
Run (no executable so we run a fake exec : beware it will be stopped, and thus only visible through docker ps -a)

	docker run --name data -d padre1-data true

PostgreSQL container for hosting the geonetwork DB: 
---------------------------------------------------

Build the postgresql image (hosting the DB for geonetwork) ; 

	docker build -t padre1-pg .
	
Running an instance of this image : 

	docker run --name pg --rm  -d padre1-pg
	
Run an instance using the data container :

	docker run --name pg -d --rm -e PGDATA=/var/lib/postgresql/data/pgdata --volumes-from data padre1-pg
	
Connect to it and execute commands : 

	docker exec -it pg /bin/bash
	
Geonetwork container
--------------------
Build the image :

	docker build -t padre1-gn .

Run a container from this image:

	docker run --name gn --link pg:pg  -p 8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork --rm padre1-gn
	(add -d if you want it as daemon)
	
Run using the data container:

	docker run --name gn --link pg:pg  -p 8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork -e DATA_DIR=/var/padre/geonetwork_datadir --rm  --volumes-from data padre1-gn
	
TODO:
- more configurable Dockerfile

TODO
----

- Geoserver image
- geodata pgsql image
- more automation
