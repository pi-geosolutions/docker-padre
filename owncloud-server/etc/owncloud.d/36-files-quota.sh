#!/usr/bin/env bash

echo "Setting default files quota..."
occ config:app:set files default_quota --value="10MB"

true
