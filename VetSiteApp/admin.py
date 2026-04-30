# Arquivo responsável por avisar a interface admnistrativa quais tabelas serão gerenciadas pelo admin.

from django.contrib import admin

from .models import Product, Category, ConfigurationSite

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ConfigurationSite)