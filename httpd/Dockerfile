FROM php:5.6-apache
MAINTAINER Jean Pommier <jean.pommier@pi-geosolutions.fr>

LABEL version="1.0"
LABEL description="Apache 2 / PHP with postgresql support"

RUN apt-get update && apt-get install -y \
  libpq-dev \
  vim 
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/include/postgresql \
  && docker-php-ext-install pgsql pdo_pgsql

EXPOSE 80
CMD ["apache2-foreground"]
