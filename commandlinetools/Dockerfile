FROM debian:stretch
#FROM ubuntu:16.04
MAINTAINER Jean Pommier "jp@pi-geosolutions.fr"
#Gives a SSH access + several SIG & more general commandline tools : GDAL, python with geospatial extensions
# SSH part taken from https://hub.docker.com/r/macropin/sshd/
# Also runs CRON
# Uses supervisor in order to run side-by-side cron and sshd

#install ssh server + system utilities
RUN apt-get update && \
    apt-get install -y \
		          cron \
			        git \
              locate \
              openjdk-8-jre \
              openssh-server \
              p7zip \
              rsync \
              supervisor \
              tar \
              vim-nox \
              wget \
              xsltproc

#install postgresql/postgis support, gdal, libgrib API
# & python virtualenv that will be used by any user needing it to install its specific python libs : 
# numpy, scipy, rasterstats (http://pythonhosted.org/rasterstats/installation.html), statsmodel, 
RUN apt-get update && \
    apt-get install -y \
              gdal-bin \
              libgdal20 \
              libgdal-dev \
              libgrib-api0 \
              locales \
              postgis \
              postgresql-client \
              python \
              python3-dev \
              python-gdal \
              python-pip \
              python-virtualenv \
    && rm -rf /var/lib/apt/lists/* && apt-get clean \
    && pip install --upgrade pip

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
#Set locale
#RUN sed -i -e 's/# fr_FR.UTF-8 UTF-8/fr_FR.UTF-8 UTF-8/' /etc/locale.gen && \
#    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
#    locale-gen && \
#    update-locale LANG=en_US.UTF-8 && \
#    echo "LANGUAGE=en_US.UTF-8" >> /etc/default/locale
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 \
    && localedef -i fr_FR -c -f UTF-8 -A /usr/share/locale/locale.alias fr_FR.UTF-8
ENV LANG en_US.utf8

EXPOSE 22

#add user files skeleton for useradd (needed for custom bash prompt
ADD etc/skel/* /etc/skel/

ADD supervisord.conf /etc/supervisor/conf.d/
RUN mkdir -p /var/log/supervisor

ADD entry.sh /entry.sh
RUN chmod u+x /entry.sh

ENTRYPOINT ["/entry.sh"]

#CMD ["/usr/sbin/sshd", "-D", "-f", "/etc/ssh/sshd_config"]

CMD ["/usr/bin/supervisord"]
