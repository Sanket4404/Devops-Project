-- Database initialization script for Boutique Microservices
-- This file will be executed when PostgreSQL container starts

-- ============================================================
-- AUTH DB
-- ============================================================
\c auth_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@boutique.com', '$2a$10$placeholder_hash', 'Admin', 'User', 'admin'),
('customer@boutique.com', '$2a$10$placeholder_hash', 'John', 'Doe', 'customer');

-- ============================================================
-- PRODUCTS DB
-- ============================================================
\c products_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100),
    brand VARCHAR(100),
    category_id UUID REFERENCES categories(id),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    materials TEXT,
    care_instructions TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (id, name, description) VALUES
('10000000-0000-0000-0000-000000000001', 'Dresses', 'Elegant dresses for special occasions'),
('10000000-0000-0000-0000-000000000002', 'Accessories', 'Luxury accessories and fashion items'),
('10000000-0000-0000-0000-000000000003', 'Bags', 'Designer handbags and tote bags'),
('10000000-0000-0000-0000-000000000004', 'Outerwear', 'Coats and jackets'),
('10000000-0000-0000-0000-000000000005', 'Shoes', 'Designer footwear and heels');

INSERT INTO products (id, name, slug, description, short_description, sku, brand, category_id, price, compare_price, inventory_quantity, is_featured) VALUES
(gen_random_uuid(), 'Silk Evening Gown', 'silk-evening-gown',
'Beautiful floor-length gown crafted from premium silk', 'Luxurious silk evening gown', 'LEG-001', 'LUXE BOUTIQUE',
'10000000-0000-0000-0000-000000000001', 1899.00, 2299.00, 15, true),

(gen_random_uuid(), 'Cashmere Coat', 'cashmere-coat',
'Elegant wool and cashmere blend coat for winter', 'Warm luxury coat', 'COAT-001', 'LUXE BOUTIQUE',
'10000000-0000-0000-0000-000000000004', 899.00, 1200.00, 20, true),

(gen_random_uuid(), 'Leather Handbag', 'leather-handbag',
'Premium Italian leather tote bag', 'Luxury leather tote', 'BAG-001', 'LUXE BOUTIQUE',
'10000000-0000-0000-0000-000000000003', 599.00, 799.00, 25, true),

(gen_random_uuid(), 'Diamond Necklace', 'diamond-necklace',
'Stunning diamond pendant necklace', 'Elegant diamond jewelry', 'JWL-001', 'LUXE BOUTIQUE',
'10000000-0000-0000-0000-000000000004', 2999.00, 3999.00, 10, true),

(gen_random_uuid(), 'Designer Heels', 'designer-heels',
'Elegant stiletto heels in premium leather', 'Luxury high heels', 'SHOES-001', 'LUXE BOUTIQUE',
'10000000-0000-0000-0000-000000000005', 499.00, 699.00, 18, true);

-- ============================================================
-- ORDERS DB
-- ============================================================
\c orders_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
