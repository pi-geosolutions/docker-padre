FROM ubuntu:16.04
MAINTAINER Jean Pommier "jp@pi-geosolutions.fr"
#Gives a SSH access + several SIG & more general commandline tools : GDAL, python with geospatial extensions
# SSH part taken from https://hub.docker.com/r/macropin/sshd/

#install ssh server + system utilities
RUN apt-get update && \
    apt-get install -y \
              openssh-server \
              p7zip \
              rsync \
              tar \
              wget \
    && apt-get clean

#install postgresql/postgis support, gdal & python tools : numpy, scipy, rasterstats (http://pythonhosted.org/rasterstats/installation.html), statsmodel, 
RUN apt-get update && \
    apt-get install -y \
              gdal-bin \
              libgdal1i \
              libgdal-dev \
              postgis \
              postgresql-client \
              python \
              python-gdal \
              python-pil \
              python-pip \
              python-pyproj \
              python-scipy \
              python-statsmodels\
    && apt-get clean \
    && pip install --upgrade pip \
    && pip install rasterstats

#Install pygrib (https://github.com/jswhit/pygrib)
#RUN cd /tmp && \
#    wget https://pypi.python.org/packages/3c/16/d128a64f2f5e9f776d6e080ba62551b5d103a4c0acb283204135bd23f14e/pygrib-2.0.2.tar.gz#md5=5ba35af5834c81711409031ed5e7d5cd  -O - | tar -xz && \
#    mv pygrib-2.0.2 /var/lib/ && \
#FINISH IT but first check if Philippe needs it   

RUN mkdir -p ~root/.ssh /etc/authorized_keys && chmod 700 ~root/.ssh/ && \
    sed -i -e 's@^AuthorizedKeysFile.*@@g' /etc/ssh/sshd_config  && \
    echo "AuthorizedKeysFile\t.ssh/authorized_keys /etc/authorized_keys/%u" >> /etc/ssh/sshd_config && \
    cp -a /etc/ssh /etc/ssh.cache 

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

EXPOSE 22

COPY entry.sh /entry.sh

ENTRYPOINT ["/entry.sh"]

CMD ["/usr/sbin/sshd", "-D", "-f", "/etc/ssh/sshd_config"]
