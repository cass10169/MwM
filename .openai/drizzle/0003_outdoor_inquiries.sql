-- Additive migration. No original assets, catalog records, or previous inquiries are deleted.
ALTER TABLE inquiries ADD COLUMN company TEXT;
ALTER TABLE inquiries ADD COLUMN company_website TEXT;
ALTER TABLE inquiries ADD COLUMN partnership_type TEXT;
ALTER TABLE inquiries ADD COLUMN project_timing TEXT;
