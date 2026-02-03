from django.contrib import admin
from .models import Brand, Category, Product, ProductImage, LifestyleImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'is_featured', 'is_active')
    list_editable = ('is_featured', 'is_active')
    list_filter = ('brand', 'category', 'is_featured', 'is_active')
    search_fields = ('name', 'brand__name', 'model_code')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'brand', 'category', 'model_code', 'description', 'price', 'stock_quantity')
        }),
        ('Параметры изделия', {
            'fields': ('material', 'color_name', 'protection', 'is_handmade', 'package_contents')
        }),
        ('Статус', {
            'fields': ('is_active', 'is_featured')
        }),
    )

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(LifestyleImage)
class LifestyleImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
