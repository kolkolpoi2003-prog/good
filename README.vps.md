# Руководство по деплою (VPS)

Это итоговая инструкция по установке и запуску проекта **Yarko Solntse** на VPS.

## 1. Подготовка сервера
Убедитесь, что на сервере установлены:
- **Docker** и **Docker Compose**
- Открыты порты: `80` (HTTP), `443` (HTTPS) и `22` (SSH)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 2. Установка проекта
1. Склонируйте репозиторий или загрузите файлы в папку `/var/www/yarko-solntse`.
2. Создайте и настройте файл `.env` на основе примера. Убедитесь, что указаны:
   - `DOMAIN=yarko-solntse.online`
   - `EMAIL=admin@yarko-solntse.online`

## 3. Первый запуск и получение SSL (Bootstrapping)
Поскольку Nginx не запустится без сертификатов, нужно выполнить цепочку команд:

### Шаг А: Временный конфиг Nginx
```bash
cat << 'EOF' > nginx/nginx.conf
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name yarko-solntse.online www.yarko-solntse.online;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'OK'; }
    }
}
EOF
```

### Шаг Б: Запуск Nginx и получение сертификата
```bash
docker-compose up -d nginx
docker compose run --rm --entrypoint "" certbot certbot certonly --webroot --webroot-path=/var/www/certbot --email admin@yarko-solntse.online --agree-tos --no-eff-email -d yarko-solntse.online -d www.yarko-solntse.online
```

### Шаг В: Возврат основного конфига
Теперь замените `nginx/nginx.conf` на основной файл из репозитория (который с настройками SSL и Proxy).

## 4. Полноценный запуск
После получения сертификатов просто запустите скрипт деплоя:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Полезные команды
- **Логи**: `docker-compose logs -f web` (или `nginx`, `postgres`)
- **Статус**: `docker-compose ps`
- **Перезапуск**: `docker-compose restart`
- **Обновление кода**: `./scripts/deploy.sh` (скрипт сам сделает `git pull`, `build` и `migrate`)

---
**Сайт работает по адресу:** [https://yarko-solntse.online](https://yarko-solntse.online)
