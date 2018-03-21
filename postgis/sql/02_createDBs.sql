-- create DBs

CREATE DATABASE geodata WITH OWNER padre;
\connect geodata;
CREATE EXTENSION postgis;
-- make sure role 'padre' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT ALL ON SEQUENCES TO padre;


CREATE DATABASE geodash WITH OWNER padre;
\connect geodash;
-- make sure role 'padre' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT ALL ON SEQUENCES TO padre;


CREATE DATABASE geonetwork WITH OWNER padre;
\connect geonetwork;
-- make sure role 'padre' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT ALL ON SEQUENCES TO padre;


CREATE DATABASE pialert WITH OWNER padre;
\connect pialert;
CREATE EXTENSION postgis;
-- make sure role 'padre' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA public GRANT ALL ON SEQUENCES TO padre;
