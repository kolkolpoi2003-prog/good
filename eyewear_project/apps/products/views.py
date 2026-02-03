from django.views.generic import ListView, DetailView
from .models import Product, Brand, Category

class ProductListView(ListView):
    model = Product
    template_name = 'products/catalog.html'
    context_object_name = 'products'
    paginate_by = 12

    def get_queryset(self):
        queryset = super().get_queryset().select_related('brand', 'category').filter(is_active=True)
        category_slug = self.kwargs.get('category_slug')
        brand_slug = self.kwargs.get('brand_slug')
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)
            
        return queryset

class ProductDetailView(DetailView):
    model = Product
    template_name = 'products/detail.html'
    context_object_name = 'product'
    slug_url_kwarg = 'slug'

class BrandListView(ListView):
    model = Brand
    template_name = 'products/brands.html'
    context_object_name = 'brands'

class CategoryListView(ListView):
    model = Category
    template_name = 'products/categories.html'
    context_object_name = 'categories'
