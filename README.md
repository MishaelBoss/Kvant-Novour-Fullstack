# Кванториум Новоуральск — Платформа управления образовательным контентом

Полнофункциональная платформа для технопарка «Кванториум» в Новоуральске. Управление пользователями, новостями, формами/квизами, уведомлениями и достижениями.

## Технологии

| Слой | Технологии                                                 |
|------|------------------------------------------------------------|
| **Фронтенд** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI |
| **Бэкенд** | Django 6, Django REST Framework, SimpleJWT                 |
| **База данных** | PostgreSQL 18                                              |
| **Аутентификация** | JWT (access + refresh токены в HttpOnly cookie)            |
| **Прокси** | nginx                                                      |
| **Контейнеризация** | Docker & Docker Compose                                    |

## Структура проекта

```
Kvant-Novour-Fullstack/
├── docker-compose.yml     # Оркестрация всех сервисов
├── backend/               # Django REST API
│   ├── core/              # Конфигурация Django (settings, urls, wsgi)
│   ├── users/             # Пользователи, регистрация, авторизация, сессии
│   ├── news/              # Новости
│   ├── forms/             # Формы и квизы
│   ├── notifications/     # Уведомления
│   └── media/             # Загруженные файлы
├── frontend/              # Next.js приложение
│   ├── app/               # App Router страницы
│   │   ├── (auth)/        # Страницы входа/регистрации
│   │   ├── (main)/        # Основные страницы (профиль, новости, квизы)
│   │   ├── admin-panel/   # Админ-панель
│   │   ├── kvanto_form/   # Конструктор форм и ответы
│   │   ├── components/    # Общие компоненты
│   │   ├── context/       # React-контексты
│   │   ├── lib/           # API-клиент (axios)
│   │   └── types/         # TypeScript-интерфейсы
│   └── public/            # Статические файлы
└── gateway/               # nginx reverse proxy
```

## Быстрый старт

### Через Docker (рекомендуется)

```bash
docker compose up --build
```

Приложение будет доступно на `http://localhost`.

### Локальная разработка

**Бэкенд:**

```bash
cd backend
poetry install
```

Убедитесь, что PostgreSQL запущен с параметрами из `backend/core/settings.py`:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

**Фронтенд:**

```bash
cd frontend
npm install
npm run dev
```

## Доступные скрипты

### Фронтенд

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка для продакшена |
| `npm run lint` | Проверка кода ESLint |

### Бэкенд

| Команда | Описание |
|---------|----------|
| `python manage.py migrate` | Применить миграции БД |
| `python manage.py runserver` | Запуск сервера |
| `python manage.py createsuperuser` | Создать администратора |

## Роли пользователей

- **Администратор** — полный доступ к админ-панели и управлению
- **Преподаватель** — создание форм/квизов, управление группами
- **Ученик** — прохождение форм, просмотр новостей
- **Родитель** — просмотр информации
- **Пользователь** — базовая роль, назначается по умолчанию

## API

API доступен по пути `/api/`. Основные эндпоинты:

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/register/` | Регистрация |
| POST | `/api/login/` | Вход |
| GET | `/api/is_authenticated/` | Проверка авторизации |
| POST | `/api/logout/` | Выход |
| PATCH | `/api/edit-profile/` | Редактирование профиля |
| GET | `/api/sessions-list/` | Список активных сессий |
| DELETE | `/api/sessions-delete/<id>/` | Удалить сессию |
| DELETE | `/api/sessions-delete-all/` | Завершить все сеансы |
| POST | `/api/upload-avatar/` | Загрузить аватар |

## Переменные окружения

В текущей версии настройки заданы в `backend/core/settings.py`. Для продакшена рекомендуется вынести в переменные окружения:

- `SECRET_KEY` — секретный ключ Django
- `DATABASE_URL` — строка подключения к БД
- `DEBUG` — режим отладки
- `ALLOWED_HOSTS` — разрешённые хосты

## Лицензия

MIT
