#!/bin/bash

#create default index.html file if it does not exist
touch /var/www/html/index.html

#Copy phppgadmin folder to /var/www/html
cp -pr /var/www/phppgadmin-${PHPPGADMIN_VERSION} /var/www/html/
mv /var/www/html/phppgadmin-${PHPPGADMIN_VERSION} /var/www/html/pgadmin
chown -R www-data:www-data /var/www/html
chmod -R 664 /var/www/html 

#add 'padre' to list of users banned from phppgadmin
sed -i -E "s|'pgsql', 'postgres', 'root', 'administrator'|'pgsql', 'postgres', 'root', 'padre', 'collect', 'administrator'|gm" pgadmin/classes/Misc.php

rm /run/apache2/apache2.pid
exec /usr/sbin/apache2ctl -D FOREGROUND
