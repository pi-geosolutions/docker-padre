ALTER TABLE groups ALTER COLUMN email TYPE varchar(128);
UPDATE Settings SET datatype = 3 WHERE name = 'map/proj4js';
UPDATE Settings SET datatype = 3 WHERE name = 'metadata/editor/schemaConfig';
