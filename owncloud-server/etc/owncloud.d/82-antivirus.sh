#!/usr/bin/env bash

echo "Enabling antivirus app..."
occ app:enable files_antivirus
occ config:app:set files_antivirus av_mode --value="executable"
occ config:app:set files_antivirus av_infected_action --value="delete"

true
