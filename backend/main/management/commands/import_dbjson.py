import json
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from main.models import Category, Product


class Command(BaseCommand):
	help = "Import categories and products from frontend/db.json into Django models"

	def add_arguments(self, parser):
		parser.add_argument(
			"--file",
			help="Path to db.json (defaults to HopyfyCart/frontend/db.json)",
			default=None,
		)
		parser.add_argument(
			"--reset",
			action="store_true",
			help="Delete existing products before import",
		)

	def handle(self, *args, **options):
		base_dir = Path(__file__).resolve().parents[4]  # .../HopyfyCart
		default_json = base_dir / "frontend" / "db.json"
		json_path = Path(options.get("file") or default_json)

		if not json_path.exists():
			raise CommandError(f"db.json not found at: {json_path}")

		with json_path.open("r", encoding="utf-8") as f:
			try:
				payload = json.load(f)
			except json.JSONDecodeError as e:
				raise CommandError(f"Invalid JSON: {e}")

		products = payload.get("products", [])
		if not isinstance(products, list):
			raise CommandError("'products' must be a list in db.json")

		if options.get("reset"):
			self.stdout.write("--reset specified: deleting existing products...")
			Product.objects.all().delete()

		created_count = 0
		updated_count = 0

		@transaction.atomic
		def import_batch():
			nonlocal created_count, updated_count
			for item in products:
				# Extract and normalize fields from JSON
				pid = str(item.get("id") or "").strip()
				if not pid:
					# Skip items without an id
					continue

				name = (item.get("name") or "").strip()
				brand = (item.get("brand") or "").strip()
				description = (item.get("description") or "").strip()

				# Map price/original_price/discount from various keys
				def to_decimal(value, default="0"):
					if value is None:
						value = default
					try:
						return Decimal(str(value))
					except Exception:
						return Decimal("0")

				price = to_decimal(item.get("price"))
				original_price = to_decimal(item.get("originalPrice")) if item.get("originalPrice") is not None else None
				discount_percentage = to_decimal(item.get("discountPercentage")) if item.get("discountPercentage") is not None else None

				# Stock/count mapping
				count = item.get("count")
				try:
					stock = int(count) if count is not None else 0
				except Exception:
					stock = 0

				# Sizes/images fields
				sizes = item.get("sizes") or []
				if not isinstance(sizes, list):
					sizes = []
				images = item.get("image") or item.get("images") or []
				if not isinstance(images, list):
					images = []

				shoe_type = (item.get("shoeType") or "").strip()
				color = (item.get("color") or item.get("Color") or "").strip()
				material = (item.get("material") or "").strip()
				weight = (item.get("weight") or "").strip()
				is_active = bool(item.get("isActive", True))

				# Category handling: create/get by name
				category_name = (item.get("category") or "Uncategorized").strip() or "Uncategorized"
				category_obj, _ = Category.objects.get_or_create(name=category_name)

				# Upsert Product by id
				obj, created = Product.objects.update_or_create(
					id=str(pid),
					defaults={
						"name": name,
						"brand": brand,
						"description": description,
						"price": price,
						"original_price": original_price,
						"discount_percentage": discount_percentage,
						"stock": stock,
						"sizes": sizes,
						"shoe_type": shoe_type,
						"color": color,
						"material": material,
						"weight": weight,
						"is_active": is_active,
						"category": category_obj,
						"images": images,
					},
				)
				if created:
					created_count += 1
				else:
					updated_count += 1

		import_batch()

		self.stdout.write(self.style.SUCCESS(
			f"Import complete. Created: {created_count}, Updated: {updated_count}"
		))


