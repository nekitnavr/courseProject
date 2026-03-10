--Add GIN index for title and description of Inventory
CREATE INDEX inventory_fts_idx ON "Inventory" USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));