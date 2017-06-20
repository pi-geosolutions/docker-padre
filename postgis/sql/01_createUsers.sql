CREATE USER padre WITH PASSWORD 'padre';
-- needed for some connexions using padre user (assumed he has a DB at his name)
CREATE DATABASE padre WITH OWNER padre;

-- create user collect for use with COLLECTscanner app
CREATE USER collect WITH PASSWORD 'collect' IN ROLE padre;

