# Запуск приложения
_Перед запуском приложения, необходимо установить и запустить docker + docker-compose_

## Инициализация
>_Для установки некоторый зависимостей, может потребоваться использование VPN._

Запустите в корневой директории проекта скрипт:
```
docker compose -f docker/docker-compose.deploy.yml --env-file .env up --abort-on-container-exit
```

---

### 1. Запуск и сборка docker в dev режиме
Чтобы собрать и запустить docker для разработки запустите в корневой директории скрипт:
```
$env:NODE_ENV="dev"; docker compose up -d --build
```

### 2. Запуск и сборка docker в production режиме
Чтобы собрать и запустить docker в production режиме запустите в корневой директории скрипт:
```
$env:NODE_ENV="production"; docker compose up -d --build
```
_По умолчанию без указания переменной NODE_ENV контейнер запустится в production режиме_

### 3. Разработка в server container
После запуска docker в режиме разработки запустите в корневой директории скрипт:
```
docker compose exec server sh
```

### 4. Посев данных
Для посева начальных данных в БД, находясь в server container выполните следующие команды:
```
npm run prisma:seed
```

### 5. Тестирование
Для выполнения тестов, находясь в server container выполните следующие команды:
```
npm run test
```

### 6. Полезная информация
Документация REST API:
```
http://localhost:3000/api/v1/docs
```

Управление БД pgadmin:

```
http://localhost:5050/
```

* _Имя/адрес сервера_: `database`
* _Имя пользователя_: `username`
* _Пароль_: `password`