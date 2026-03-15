import os
import sys
import django
import random

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from main.models import ProductImage

def update_images():
    print("Updating product images with sample internet images...")
    
    # List of reliable shoe images from unsplash and other free sources
    sample_images = [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", # Red Nike
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop", # Puma
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1000&auto=format&fit=crop", # Vans
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop", # Nike Air Max
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop", # Colorful sneakers
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop", # Brown leather boots
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop", # Adidas White
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop", # New Balance
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop", # Nike Jordan
        "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?q=80&w=1000&auto=format&fit=crop", # Converse
    ]
    
    images = ProductImage.objects.all()
    count = 0
    
    for img in images:
        if img.image_url and img.image_url.startswith('/Images/'):
            # Randomly select one of the neat shoe images
            img.image_url = random.choice(sample_images)
            img.save()
            count += 1
            
    print(f"Successfully updated {count} images to use internet sources.")

if __name__ == '__main__':
    update_images()
