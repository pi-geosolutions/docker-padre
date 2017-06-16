/* adds schema odk1 in geodata DB, for odkaggregate use.*/

\connect geodata;
CREATE SCHEMA odk1 AUTHORIZATION padre;
#GRANT ALL PRIVILEGES ON SCHEMA odk1 TO padre;


-- make sure role 'padre' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA odk1 GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA odk1 GRANT ALL ON SEQUENCES TO padre;
