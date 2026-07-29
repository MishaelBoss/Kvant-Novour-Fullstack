from pathlib import Path
from datetime import timedelta
import os
from celery.schedules import crontab

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^l=c^blbtb5i7q07b+c(r+0qg9gh%p=@j8p%l=f%^s1@pd1h!f'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['8326-46-28-64-177.ngrok-free.app', 'localhost', '127.0.0.1', '0.0.0.0']
CSRF_TRUSTED_ORIGINS = ['https://ngrok-free.app']

ASGI_APPLICATION = 'core.asgi.application'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt',
    'users',
    'news',
    'forms',
    'notifications',
    'corsheaders',
    'rest_framework',
    'django_user_agents',
    'rest_framework_simplejwt.token_blacklist',
    'channels',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True 
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

REDIS_HOST = os.getenv('REDIS_HOST', 'redis')

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [{
                'address': (REDIS_HOST, 6379),
                'socket_keepalive': True,
                'socket_timeout': 30,
                'socket_connect_timeout': 10,
                'retry_on_timeout': True,
            }],
            'max_connections': 50,
        },
    },
}


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'kvantum_db',
        'USER': 'postgres',
        'PASSWORD': 'cr2032',
        'HOST': 'db',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'users.authentication.CookieJWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

#LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'TOKEN_OBTAIN_SERIALIZER': 'users.serializers.MyTokenObtainPairSerializer',
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'CHECK_REVOCATION_TOKEN': True,
}

CELERY_BROKER_URL = f'redis://{REDIS_HOST}:6379/0'
CELERY_RESULT_BACKEND = f'redis://{REDIS_HOST}:6379/0'

# Синхронизация часового пояса Celery с основным часовым поясом Django (переменная TIME_ZONE).
# Это нужно, чтобы задачи по расписанию (например, ночная очистка) выполнялись по вашему времени.
CELERY_TIMEZONE = TIME_ZONE

# Включает подробный статус "В процессе" (STARTED). 
# Без этого настройки показывают только два состояния задачи: "Ожидает" и "Завершено".
CELERY_TASK_TRACK_STARTED = True

# Жесткий лимит времени на выполнение одной задачи — 30 минут (30 * 60 секунд).
# Если задача зависнет (например, из-за бесконечного цикла), Celery принудительно убьет её, чтобы спасти сервер.
CELERY_TASK_TIME_LIMIT = 30 * 60

CELERY_BEAT_SCHEDULE = {
    'cleanup-old-notifications': {
        'task': 'notifications.tasks.cleanup_old_notifications',
        'schedule': crontab(hour=3, minute=0),
    },
}