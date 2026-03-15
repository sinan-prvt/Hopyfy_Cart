from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')


SECRET_KEY = 'django-insecure-7i*j1l@t%+_6fo5@(v)64rv&%t$r57$a!4o24#8pk_v*p4_ci8'


ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'main',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

AUTH_USER_MODEL = 'main.User'   


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                "django.template.context_processors.debug",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', os.path.join(BASE_DIR, 'db.sqlite3')),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
        'CONN_MAX_AGE': int(os.getenv('DB_CONN_MAX_AGE', 600)),
        'ATOMIC_REQUESTS': False,
        'OPTIONS': {
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000',
        } if 'postgresql' in os.getenv('DB_ENGINE', '') else {},
    }
}

# Database Connection Pooling (for PostgreSQL RDS)
if 'postgresql' in os.getenv('DB_ENGINE', ''):
    DATABASES['default']['ENGINE'] = 'dj_db_pool.base'
    DATABASES['default']['ORIGINAL_ENGINE'] = 'django.db.backends.postgresql'
    DATABASES['default']['POOL'] = {
        'min_size': int(os.getenv('DB_POOL_MIN_SIZE', 5)),
        'max_size': int(os.getenv('DB_POOL_MAX_SIZE', 20)),
        'max_overflow': int(os.getenv('DB_POOL_MAX_OVERFLOW', 10)),
        'timeout': int(os.getenv('DB_POOL_TIMEOUT', 30)),
        'recycle': int(os.getenv('DB_POOL_RECYCLE', 3600)),
    }


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

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR / 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



CORS_ALLOW_CREDENTIALS = True


CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://hopyfy-cart-frontend.s3-website.ap-south-1.amazonaws.com",
]


CSRF_TRUSTED_ORIGINS = [
    "http://hopyfy-cart-frontend.s3-website.ap-south-1.amazonaws.com"
]

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


APPEND_SLASH = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'hopyfycart@gmail.com'  
EMAIL_HOST_PASSWORD = 'xoxi uuvc gkdw xmaj'

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

PASSWORD_RESET_TIMEOUT = 3600


RAZORPAY_KEY_ID = "rzp_test_RW09vFtgmOJX0Z"
RAZORPAY_KEY_SECRET = "2KrKe0MyEgIbL0eWSMNV7ojp"
