#!/bin/bash

#create default index.html file if it does not exist
touch /var/www/html/index.html

rm /run/apache2/apache2.pid
exec /usr/sbin/apache2ctl -D FOREGROUND
