from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = "django-secret-key"

AUTH_USER_MODEL = "users.User"

ALLOWED_HOSTS = ["*"]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# CSRF_TRUSTED_ORIGINS = ["https://*"]
# CSRF_COOKIE_SECURE = False
# CSRF_COOKIE_SAMESITE = 'None'

SESSION_COOKIE_SECURE = False
SESSION_COOKIE_AGE = 31449600  # 1 Year

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "django_filters",
    "corsheaders",

    "apps.users",
    "apps.reviews",
    "apps.houses",
    "apps.tasks"
]

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'utils.exceptions.custom_exception_handler',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'utils.auth.CsrfExemptSessionAuthentication',
    ),
    'PAGE_SIZE': 100
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / 'templates']
        ,
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "ru-ru"
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = False

STATIC_ROOT = "static-django"
STATIC_URL = "/static-django/"
MEDIA_URL = "/media/"
MEDIA_ROOT = "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"