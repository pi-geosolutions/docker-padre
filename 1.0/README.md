
PostgreSQL container for hosting the geonetwork DB: 
---------------------------------------------------

Build the postgresql image (hosting the DB for geonetwork) ; 
	docker build -t padre1-pg .
Running an instance of this image : 
	docker run --name pg --rm  -d padre1-pg
Connect to it and execute commands : 
	docker exec -it pg /bin/bash
	
TODO : 
- use a volume for DB persistence

Geonetwork container
--------------------
Build the image :
	docker build -t padre1-gn .

Run a container from this image:
	docker run --name gn --link pg:pg  -p 8080 -e POSTGRES_DB_USERNAME=geonetwork -e POSTGRES_DB_PASSWORD=geonetwork --rm padre1-gn
	(add -d if you want it as daemon)
	
TODO:
- use a volume for data persistence
- more configurable Dockerfile


TODO
----

- Implement TODOs
- Geoserver image
- geodata pgsql image
- more automation
