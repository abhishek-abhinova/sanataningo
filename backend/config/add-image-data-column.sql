-- Add image_data column to gallery table for Base64 storage
ALTER TABLE gallery ADD COLUMN image_data LONGTEXT NULL AFTER image_url;

-- Add index for better performance
CREATE INDEX idx_gallery_has_image_data ON gallery ((CASE WHEN image_data IS NOT NULL THEN 1 ELSE 0 END));