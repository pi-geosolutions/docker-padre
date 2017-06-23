CREATE TABLE metadataidentifiertemplate
(
  id integer NOT NULL,
  name character varying(32) NOT NULL,
  isprovided character(1) NOT NULL DEFAULT 'n'::bpchar,
  template character varying(255) NOT NULL,
  CONSTRAINT metadataidentifiertemplate_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


ALTER TABLE users ADD column enabled boolean;

CREATE TABLE mapservers
(
  id integer NOT NULL,
  configurl character varying(255) NOT NULL,
  description character varying(255),
  name character varying(32) NOT NULL,
  namespace character varying(255),
  namespaceprefix character varying(255),
  password character varying(128),
  pushstyleinworkspace character(1),
  stylerurl character varying(255),
  username character varying(128),
  wcsurl character varying(255),
  wfsurl character varying(255),
  wmsurl character varying(255),
  CONSTRAINT mapservers_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

