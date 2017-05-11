This repository contains the components necessary to create a basic Docker
container for [ODK Aggregate](https://opendatakit.org/use/aggregate/) paired
with PostgreSQL. The image is based on a Tomcat8 image, and retrieves the 
ODK Aggregate war file from the location defined by AGGREGATE_URL env var.

# Instructions
This ODK Aggregate image must be paired with a postgresql container to function
properly. 


# Aknowledgements
This docker image is based on the work of [Kharatsa](https://github.com/Kharatsa/odkaggregate) 
with some adjustments and optimizations
