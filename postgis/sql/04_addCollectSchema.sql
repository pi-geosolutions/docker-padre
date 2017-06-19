/* adds schema odk1 in geodata DB, for odkaggregate use.*/

\connect geodata;
CREATE SCHEMA collect AUTHORIZATION collect;
GRANT ALL PRIVILEGES ON SCHEMA collect TO padre;


-- make sure roles 'padre' & 'collect' will have access to all new created tables
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA collect GRANT SELECT ON TABLES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER padre IN SCHEMA collect GRANT ALL ON SEQUENCES TO padre;
ALTER DEFAULT PRIVILEGES FOR USER collect IN SCHEMA collect GRANT SELECT ON TABLES TO collect;
ALTER DEFAULT PRIVILEGES FOR USER collect IN SCHEMA collect GRANT ALL ON SEQUENCES TO collect;
