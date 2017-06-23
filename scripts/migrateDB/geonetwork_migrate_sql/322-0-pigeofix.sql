ALTER TABLE users ADD COLUMN isenabled CHAR(1) DEFAULT 'y';
ALTER TABLE groups ADD COLUMN enableallowedcategories boolean DEFAULT FALSE;
ALTER TABLE groups ADD COLUMN enableCategoriesRestriction CHAR(1) DEFAULT 'n';
