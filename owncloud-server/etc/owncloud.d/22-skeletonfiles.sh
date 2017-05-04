#!/usr/bin/env bash

echo "change skeleton files to use"
mv /var/www/owncloud/core/skeleton /var/www/owncloud/core/skeleton.old
mkdir --parents /var/www/owncloud/core/skeleton/collect

true
