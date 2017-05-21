FROM tomcat:7.0-jre8
MAINTAINER Jean Pommier <jean.pommier@pi-geosolutions.fr>

# Base Padre1 Geonetwork instance

RUN apt-get update && apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Override if you want to override the configs
#ENV GN_WAR_PATH /home/jean/Padre1/repo/padre1-gn.war
ENV GN_FILE_PATH /home/jean/Padre1/repo/geonetwork
ENV DATA_DIR=$CATALINA_HOME/webapps/geonetwork/WEB-INF/data
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom -Djava.awt.headless=true -server -Xms512m -Xmx2024m -XX:NewSize=512m -XX:MaxNewSize=1024m -XX:PermSize=512m -XX:MaxPermSize=1024m -XX:+UseConcMarkSweepGC"

WORKDIR $CATALINA_HOME/webapps

#COPY $GN_FILE_PATH $CATALINA_HOME/webapps/geonetwork/
COPY geonetwork $CATALINA_HOME/webapps/geonetwork/

#Set PostgreSQL as default GN DB
COPY config-overrides-prod.xml $CATALINA_HOME/webapps/geonetwork/WEB-INF/config-overrides-prod.xml


#Set geonetwork data dir
COPY ./docker-entrypoint.sh /entrypoint.sh
COPY ./wait-for-postgres.sh /wait-for-postgres.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["catalina.sh", "run"]
