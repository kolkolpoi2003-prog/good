import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
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
