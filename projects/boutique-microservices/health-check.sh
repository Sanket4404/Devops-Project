#!/bin/bash

# Boutique Microservices Health Check
echo "🔍 Checking Boutique Microservices Health..."
echo ""

# Check Frontend
echo "🌐 Frontend (localhost:3000):"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is NOT running"
fi

# Check Product Service
echo ""
echo "📦 Product Service (localhost:3003):"
PRODUCT_CHECK=$(curl -s http://localhost:3003/products 2>/dev/null)
if [ $? -eq 0 ] && [ "$PRODUCT_CHECK" != "" ]; then
    PRODUCT_COUNT=$(echo "$PRODUCT_CHECK" | jq -r '.data.products | length' 2>/dev/null || echo "N/A")
    echo "✅ Product Service is running with $PRODUCT_COUNT products"
    
    # Check first product price
    FIRST_PRICE=$(echo "$PRODUCT_CHECK" | jq -r '.data.products[0].price' 2>/dev/null || echo "N/A")
    if [ "$FIRST_PRICE" != "0" ] && [ "$FIRST_PRICE" != "null" ]; then
        echo "✅ Product prices look good (first product: \$$FIRST_PRICE)"
    else
        echo "⚠️  Product price issue detected (first product: \$$FIRST_PRICE)"
        echo "   Restart product service: pkill -f simple-product-service && node simple-product-service.js &"
    fi
else
    echo "❌ Product Service is NOT running"
fi

# Check Database
echo ""
echo "🗄️  Database (localhost:5432):"
if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    PRODUCT_COUNT_DB=$(psql -U postgres -d boutique_auth -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null | xargs)
    echo "✅ Database is connected with $PRODUCT_COUNT_DB products"
else
    echo "❌ Database is NOT connected"
fi

echo ""
echo "🔗 Quick Access Links:"
echo "   Frontend: http://localhost:3000/products"
echo "   API: http://localhost:3003/products"

# Troubleshooting section
echo ""
if ! curl -s http://localhost:3000 >/dev/null 2>&1 || ! curl -s http://localhost:3003/products >/dev/null 2>&1; then
    echo "🛠️  Quick Fixes:"
    echo "   1. Start frontend: cd frontend && npm start"
    echo "   2. Start product service: node simple-product-service.js &"
    echo "   3. Or use: ./start-services.sh"
fi