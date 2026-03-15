import os
import sys
import django
import json
from pathlib import Path

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from main.models import Product, ProductImage, Category

def import_products():
    frontend_db_path = Path(__file__).resolve().parent.parent / 'frontend' / 'db.json'
    
    with open(frontend_db_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    products_data = data.get('products', [])
    print(f"Found {len(products_data)} products in db.json")
    
    for item in products_data:
        # Create or get category
        cat_name = item.get('category', 'Uncategorized')
        category, _ = Category.objects.get_or_create(name=cat_name)
        
        # Handle decimal fields
        price = item.get('price', 0)
        original_price = item.get('originalPrice')
        discount_percentage = item.get('discountPercentage')
        
        # Format strings to float/decimal
        try:
            price = float(str(price).replace('kg', '').replace('$', '').strip()) if price else 0
        except ValueError:
            price = 0
            
        try:
            original_price = float(str(original_price).strip()) if original_price else None
        except ValueError:
            original_price = None
            
        try:
            discount_percentage = float(str(discount_percentage).strip()) if discount_percentage else None
        except ValueError:
            discount_percentage = None
        
        count = item.get('count', 0)
        try:
            stock = int(str(count).strip())
        except ValueError:
            stock = 0

        product, created = Product.objects.update_or_create(
            id=item['id'],
            defaults={
                'name': item.get('name', ''),
                'brand': item.get('brand', ''),
                'description': item.get('description', ''),
                'price': price,
                'original_price': original_price,
                'discount_percentage': discount_percentage,
                'stock': stock,
                'sizes': item.get('sizes', []),
                'shoe_type': item.get('shoeType', ''),
                'color': item.get('color', item.get('Color', '')),
                'material': item.get('material', ''),
                'weight': str(item.get('weight', '')),
                'is_active': item.get('isActive', True),
                'category': category,
            }
        )
        
        # Add images
        images = item.get('image', [])
        ProductImage.objects.filter(product=product).delete()  # Clear old images to avoid duplicates
        for img_url in images:
            if img_url:
                ProductImage.objects.create(
                    product=product,
                    image_url=img_url
                )
        print(f"{'Created' if created else 'Updated'} product {product.id} - {product.name}")

if __name__ == '__main__':
    import_products()
