from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.ProductListView.as_view(), name='catalog'),
    path('category/<slug:category_slug>/', views.ProductListView.as_view(), name='category_list'),
    path('brand/<slug:brand_slug>/', views.ProductListView.as_view(), name='brand_list'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='detail'),
]
