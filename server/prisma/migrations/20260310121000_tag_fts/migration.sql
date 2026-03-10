--Add GIN index for name and email of User
CREATE INDEX tag_fts_idx ON "Tag" USING gin(to_tsvector('english', "tagName"));