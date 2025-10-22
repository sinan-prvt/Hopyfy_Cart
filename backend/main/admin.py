from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Product, Cart, Wishlist, Order, OrderItem, ProductImage

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'role', 'is_active', 'isBlock')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'isBlock')}),
    )

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.images:
            return f'<img src="{obj.images.url}" style="width: 80px; height:80px; object-fit:cover;" />'
        elif obj.image_url:
            return f'<img src="{obj.image_url}" style="width: 80px; height:80px; object-fit:cover;" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Preview"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'brand', 'category', 'price', 'stock', 'is_active']
    list_filter = ['category', 'brand', 'is_active']
    search_fields = ['name', 'brand', 'description']
    inlines = [ProductImageInline] 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    
admin.site.register(Cart)
admin.site.register(Wishlist)
admin.site.register(Order)
admin.site.register(OrderItem)
