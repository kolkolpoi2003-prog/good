import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eyewear_project.settings')
django.setup()

from apps.products.models import Category

def restore():
    categories = [
        {'name': 'Женщинам', 'slug': 'zhenshchinam'},
        {'name': 'Мужчинам', 'slug': 'muzhchinam'},
        {'name': 'Детям', 'slug': 'detyam'},
    ]
    
    for cat_data in categories:
        obj, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
        if created:
            print(f"Created category: {cat_data['name']}")
        else:
            print(f"Category already exists: {cat_data['name']}")

if __name__ == '__main__':
    restore()
