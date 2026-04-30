import dj_database_url
import os
from pathlib import Path

# Caminho base do projeto
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-mbgsr)4qiqbjn)h$*tkwwn9ezdac2+@6m13(c^^r2+j3v@llbt'

DEBUG = True

ALLOWED_HOSTS = ['*']

# --- APLICAÇÕES ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Apps de Terceiros
    'rest_framework',
    'corsheaders', 
    
    # Seu App
    'VetSiteApp',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware', # Deve vir antes do CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'VetSite.urls'

# --- TEMPLATES (INTEGRAÇÃO REACT) ---
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Ajustado para a hierarquia da imagem: frontend > vetsite_frontend > build
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'vetsite_frontend', 'build')],
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

WSGI_APPLICATION = 'VetSite.wsgi.application'

# --- BANCO DE DADOS ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

db_from_env = dj_database_url.config(conn_max_age=600)
if db_from_env:
    DATABASES['default'].update(db_from_env)
# --- VALIDAÇÃO DE SENHA ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- INTERNACIONALIZAÇÃO ---
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# --- ARQUIVOS ESTÁTICOS ---
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    # Caminho exato onde o React joga o JS e CSS no build
    os.path.join(BASE_DIR, 'frontend', 'vetsite_frontend', 'build', 'static'),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- SEGURANÇA E CORS (Portas 3000 e 8000) ---

CORS_ALLOW_CREDENTIALS = True

# O Django autoriza o React a enviar pedidos
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# O Django confia nas requisições vindas dessas URLs
CSRF_TRUSTED_ORIGINS = [
    'https://vetsite-production.up.railway.app',
    'http://localhost:3000', # Se estiver testando o React localmente
    'http://127.0.0.1:3000'
]

# Configurações para garantir que o cookie circule entre as portas
CSRF_COOKIE_HTTPONLY = False  # Para o React conseguir ler o token
CSRF_COOKIE_SECURE = False    # Obrigatório ser False para HTTP (localhost)
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_NAME = 'csrftoken'
SESSION_COOKIE_NAME = 'sessionid'
SESSION_SAVE_EVERY_REQUEST = True

#Configuração de Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'danielsantoscosta16@gmail.com'
EMAIL_HOST_PASSWORD = 'gizu avsd firn hivu'