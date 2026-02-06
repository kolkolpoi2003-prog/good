import os
import django

# Determine settings module
settings_module = os.environ.get('DJANGO_SETTINGS_MODULE')
if not settings_module:
    # Try to detect if we are in docker or local
    if os.path.exists('/.dockerenv'):
        settings_module = 'config.settings.production'
    else:
        settings_module = 'config.settings.development'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Данные от пользователя
username = 'admin'
email = 'admin@example.com'
password = 'Kolkolpoi2026@'

# Проверяем, существует ли пользователь
if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"✓ Пароль для пользователя '{username}' обновлен!")
else:
    # Создаем суперпользователя
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"✓ Суперпользователь '{username}' создан!")

print(f"  Username: {username}")
print(f"  Password: {password}")

print("\n📌 Для входа в админ-панель:")
print("   URL: http://127.0.0.1:8000/admin/")
