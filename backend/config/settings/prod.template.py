from .base import REST_FRAMEWORK

DEBUG = False
SECRET_KEY = ""

SPRINT_HOST_PIN = ""
SPRINT_HOST_DOMAIN = ""
SPRINT_HOST_DB_NAME = ""
SPRINT_HOST_DB_PASSWORD = ""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': SPRINT_HOST_DB_NAME,
        'USER': SPRINT_HOST_DB_NAME,
        'PASSWORD': SPRINT_HOST_DB_PASSWORD,
        'HOST': "localhost",
        'PORT': '3306'
    }
}

EMAIL_HOST = ""
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = "123456"

SESSION_COOKIE_SECURE = True

MEDIA_ROOT = f'/home/{SPRINT_HOST_PIN}/domains/{SPRINT_HOST_DOMAIN}/public_html'

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
    'rest_framework.renderers.JSONRenderer',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': f'/home/{SPRINT_HOST_PIN}/domains/{SPRINT_HOST_DOMAIN}/public_html/info.log',
            'backupCount': 2,  # keep at most 2 log files
            'maxBytes': 1024 * 1024,  # 1024*1024 bytes (1MB)
            'formatter': 'verbose'
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
