-- Simple product seeding with proper UUIDs and working images

-- Add a few sample products
INSERT INTO products (id, name, slug, description, short_description, sku, brand, category_id, price, compare_price, inventory_quantity, is_featured) VALUES
(gen_random_uuid(), 'Silk Evening Gown', 'silk-evening-gown', 
'Beautiful floor-length gown crafted from premium silk', 'Luxurious silk evening gown', 'LEG-001', 'LUXE BOUTIQUE', 
'10000000-0000-0000-0000-000000000001', 1899.00, 2299.00, 15, true),

(gen_random_uuid(), 'Cashmere Coat', 'cashmere-coat', 
'Elegant wool and cashmere blend coat for winter', 'Warm luxury coat', 'COAT-001', 'LUXE BOUTIQUE', 
'10000000-0000-0000-0000-000000000004', 899.00, 1200.00, 20, true),

(gen_random_uuid(), 'Leather Handbag', 'leather-handbag', 
'Premium Italian leather tote bag', 'Luxury leather tote', 'BAG-001', 'LUXE BOUTIQUE', 
'00000000-0000-0000-0000-000000000003', 599.00, 799.00, 25, true),

(gen_random_uuid(), 'Diamond Necklace', 'diamond-necklace', 
'Stunning diamond pendant necklace', 'Elegant diamond jewelry', 'JWL-001', 'LUXE BOUTIQUE', 
'00000000-0000-0000-0000-000000000004', 2999.00, 3999.00, 10, true),

(gen_random_uuid(), 'Designer Heels', 'designer-heels', 
'Elegant stiletto heels in premium leather', 'Luxury high heels', 'SHOES-001', 'LUXE BOUTIQUE', 
'00000000-0000-0000-0000-000000000005', 499.00, 699.00, 18, true);

-- Add images for these products
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT 
    p.id,
    CASE 
        WHEN p.name LIKE '%Gown%' THEN 'https://images.unsplash.com/photo-15946338031b5-7f31b2c0d8b5?w=800&q=80'
        WHEN p.name LIKE '%Coat%' THEN 'https://images.unsplash.com/photo-1544967003-f26d5581c8a2?w=800&q=80'
        WHEN p.name LIKE '%Handbag%' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
        WHEN p.name LIKE '%Necklace%' THEN 'https://images.unsplash.com/photo-1596944924647-6e6e2b08b550?w=800&q=80'
        WHEN p.name LIKE '%Heels%' THEN 'https://images.unsplash.com/photo-1543166928-355bad0c79e4?w=800&q=80'
    END,
    p.name || ' - Main image',
    true,
    1
FROM products p
WHERE p.sku IN ('LEG-001', 'COAT-001', 'BAG-001', 'JWL-001', 'SHOES-001');