FROM busybox:latest
MAINTAINER Jean Pommier <jean.pommier@pi-geosolutions.fr>
#Data container for postgresql, geonetwork & geoserver

RUN mkdir -p /var/lib/postgresql/data/pgdata && \
	mkdir -p /var/padre/
	
#Initialize the geonetwork datadir
COPY geonetwork_datadir /var/padre/geonetwork_datadir/

VOLUME ["/var/lib/postgresql/data/pgdata", "/var/padre"]
