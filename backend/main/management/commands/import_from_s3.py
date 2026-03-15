import boto3
from decimal import Decimal
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from main.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = "Import products from S3 bucket images"

    def add_arguments(self, parser):
        parser.add_argument(
            "--bucket",
            default="hopyfy-cart-frontend",
            help="S3 bucket name (default: hopyfy-cart-frontend)",
        )
        parser.add_argument(
            "--prefix",
            default="products/",
            help="S3 prefix/folder to scan (default: products/)",
        )
        parser.add_argument(
            "--price",
            type=float,
            default=999.00,
            help="Default price for all products (default: 999.00)",
        )
        parser.add_argument(
            "--stock",
            type=int,
            default=50,
            help="Default stock quantity (default: 50)",
        )
        parser.add_argument(
            "--category",
            default="Uncategorized",
            help="Default category name (default: Uncategorized)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be imported without creating products",
        )

    def handle(self, *args, **options):
        bucket_name = options["bucket"]
        prefix = options["prefix"]
        default_price = Decimal(str(options["price"]))
        default_stock = options["stock"]
        category_name = options["category"]
        dry_run = options["dry_run"]

        # Initialize S3 client
        try:
            s3_client = boto3.client("s3")
            self.stdout.write(f"Connecting to S3 bucket: {bucket_name}")
            s3_client.head_bucket(Bucket=bucket_name)
        except Exception as e:
            raise CommandError(f"Failed to connect to S3 bucket: {e}")

        # Get or create category
        category_obj, _ = Category.objects.get_or_create(name=category_name)
        self.stdout.write(self.style.SUCCESS(f"Using category: {category_name}"))

        # List all objects in S3 bucket
        image_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        image_files = []

        try:
            paginator = s3_client.get_paginator("list_objects_v2")
            pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)

            for page in pages:
                if "Contents" not in page:
                    continue
                for obj in page["Contents"]:
                    key = obj["Key"]
                    # Skip if not an image file
                    if not any(key.lower().endswith(ext) for ext in image_extensions):
                        continue
                    if key.endswith("/"):  # Skip folder-like objects
                        continue
                    image_files.append(key)

        except Exception as e:
            raise CommandError(f"Failed to list S3 objects: {e}")

        if not image_files:
            self.stdout.write(
                self.style.WARNING(
                    f"No image files found in {bucket_name}/{prefix}"
                )
            )
            return

        self.stdout.write(
            self.style.SUCCESS(f"Found {len(image_files)} image files in S3")
        )

        # Group images by product name (from filename)
        products_dict = {}
        for image_key in image_files:
            # Extract filename without extension
            filename = image_key.split("/")[-1]
            product_name = filename.rsplit(".", 1)[0]

            if product_name not in products_dict:
                products_dict[product_name] = []
            products_dict[product_name].append(image_key)

        self.stdout.write(
            self.style.SUCCESS(f"Will create {len(products_dict)} products")
        )

        if dry_run:
            self.stdout.write("\n🔍 DRY RUN - No changes will be made\n")
            for product_name, images in sorted(products_dict.items()):
                self.stdout.write(f"\n📦 Product: {product_name}")
                self.stdout.write(f"   Images: {len(images)}")
                for img in images:
                    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{img}"
                    self.stdout.write(f"      - {s3_url}")
            return

        # Import products and link images
        created_count = 0
        updated_count = 0

        @transaction.atomic
        def import_products():
            nonlocal created_count, updated_count
            for product_name, image_keys in products_dict.items():
                obj, created = Product.objects.update_or_create(
                    name=product_name,
                    defaults={
                        "brand": "",
                        "description": f"Product {product_name}",
                        "price": default_price,
                        "stock": default_stock,
                        "category": category_obj,
                        "is_active": True,
                    },
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1
                    # Clear old images if updating
                    ProductImage.objects.filter(product=obj).delete()

                # Create ProductImage entries for each image
                for image_key in image_keys:
                    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{image_key}"
                    ProductImage.objects.create(product=obj, image_url=s3_url)

        import_products()

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Import complete!\n"
                f"   Created: {created_count}\n"
                f"   Updated: {updated_count}\n"
                f"   Total products: {len(products_dict)}"
            )
        )
        self.stdout.write("=" * 60)
