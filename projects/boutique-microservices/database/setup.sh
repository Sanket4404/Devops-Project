#!/bin/bash

# ========================================
# BOUTIQUE DATABASE SETUP SCRIPT
# ========================================

# Exit on any error
set -e

# Database configuration
DB_NAME="boutique_auth"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if database exists
check_database() {
    print_status "Checking if database '$DB_NAME' exists..."
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        print_success "Database '$DB_NAME' exists"
        return 0
    else
        print_warning "Database '$DB_NAME' does not exist. Creating it..."
        createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
        if [ $? -eq 0 ]; then
            print_success "Database '$DB_NAME' created successfully"
            return 0
        else
            print_error "Failed to create database '$DB_NAME'"
            return 1
        fi
    fi
}

# Function to execute SQL file
execute_sql() {
    local sql_file=$1
    local description=$2
    
    print_status "Executing $description..."
    
    if [ -f "$sql_file" ]; then
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$sql_file"
        if [ $? -eq 0 ]; then
            print_success "$description completed successfully"
            return 0
        else
            print_error "Failed to execute $description"
            return 1
        fi
    else
        print_error "SQL file not found: $sql_file"
        return 1
    fi
}

# Function to verify data
verify_data() {
    print_status "Verifying data integrity..."
    
    # Check products count
    PRODUCT_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM products;")
    if [ "$PRODUCT_COUNT" -eq 25 ]; then
        print_success "Products: $PRODUCT_COUNT records"
    else
        print_warning "Products: $PRODUCT_COUNT records (expected 25)"
    fi
    
    # Check categories count
    CATEGORY_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM categories;")
    if [ "$CATEGORY_COUNT" -eq 25 ]; then
        print_success "Categories: $CATEGORY_COUNT records"
    else
        print_warning "Categories: $CATEGORY_COUNT records (expected 25)"
    fi
    
    # Check variants count
    VARIANT_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM product_variants;")
    print_success "Product Variants: $VARIANT_COUNT records"
    
    # Check images count
    IMAGE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM product_images;")
    print_success "Product Images: $IMAGE_COUNT records"
    
    # Check reviews count
    REVIEW_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM product_reviews;")
    print_success "Product Reviews: $REVIEW_COUNT records"
    
    # Check total inventory value
    INVENTORY_VALUE=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT ROUND(SUM(price * inventory_quantity), 2) FROM products;")
    print_success "Total Inventory Value: \$$INVENTORY_VALUE"
}

# Function to show sample data
show_sample_data() {
    print_status "Displaying sample product data..."
    
    echo ""
    echo -e "${BLUE}=== FEATURED PRODUCTS ===${NC}"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT name, brand, price, category_name 
        FROM product_summary 
        WHERE is_featured = TRUE 
        ORDER BY price DESC 
        LIMIT 5;"
    
    echo ""
    echo -e "${BLUE}=== PRODUCT CATEGORIES ===${NC}"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT c.name, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        WHERE c.parent_id IS NULL
        GROUP BY c.name, c.id
        ORDER BY product_count DESC;"
    
    echo ""
    echo -e "${BLUE}=== AVERAGE RATINGS ===${NC}"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT p.name, ROUND(pr.avg_rating, 1) as avg_rating, pr.review_count
        FROM products p
        LEFT JOIN (
            SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count
            FROM product_reviews 
            WHERE is_approved = TRUE
            GROUP BY product_id
        ) pr ON p.id = pr.product_id
        WHERE pr.review_count > 0
        ORDER BY pr.avg_rating DESC
        LIMIT 5;"
}

# Main execution
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} BOUTIQUE DATABASE SETUP${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    # Get script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    
    print_status "Starting boutique database setup..."
    print_status "Working directory: $SCRIPT_DIR"
    
    # Check PostgreSQL connection
    print_status "Testing PostgreSQL connection..."
    if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; then
        print_error "Cannot connect to PostgreSQL. Please check your configuration."
        exit 1
    fi
    print_success "PostgreSQL connection successful"
    
    # Check/create database
    check_database
    if [ $? -ne 0 ]; then
        exit 1
    fi
    
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} EXECUTING SCHEMA SETUP${NC}"
    echo -e "${BLUE}================================${NC}"
    
    # Execute SQL files in order
    execute_sql "schema.sql" "Database schema creation"
    execute_sql "seed-categories.sql" "Categories data seeding"
    execute_sql "seed-products.sql" "Products data seeding"
    execute_sql "seed-images-final.sql" "Product images seeding"
    execute_sql "seed-variants.sql" "Product variants seeding"
    execute_sql "seed-reviews.sql" "Product reviews seeding"
    
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} DATA VERIFICATION${NC}"
    echo -e "${BLUE}================================${NC}"
    
    # Verify data
    verify_data
    
    # Show sample data
    show_sample_data
    
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN} SETUP COMPLETED SUCCESSFULLY${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    print_status "Database '$DB_NAME' is ready for use!"
    print_status "You can now connect your microservices to the database."
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update your microservice configuration with database connection details"
    echo "2. Test API endpoints with the seeded data"
    echo "3. Review the product catalog and make any needed adjustments"
    echo ""
    echo -e "${YELLOW}Note:${NC} Make sure to update image URLs in the seed-images.sql file"
    echo "      with your actual image hosting paths."
    echo ""
}

# Run main function
main "$@"