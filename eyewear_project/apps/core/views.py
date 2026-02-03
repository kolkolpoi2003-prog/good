from django.views.generic import TemplateView
from apps.products.models import Product, Category
from apps.blog.models import BlogPost

class HomeView(TemplateView):
    template_name = 'home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Categories with lifestyle images
        context['categories'] = Category.objects.all().prefetch_related('lifestyleimage_set')
        
        # Top models (featured products) with brand and images
        context['top_models'] = Product.objects.filter(
            is_featured=True, 
            is_active=True
        ).select_related('brand').prefetch_related('images')[:10]
        
        # Latest blog posts
        context['blog_posts'] = BlogPost.objects.filter(
            is_published=True
        ).order_by('-created_at')[:3]
        
        return context
