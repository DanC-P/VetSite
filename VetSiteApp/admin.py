from django.contrib import admin

from .models import Product, Category, Banner, ConfigurationSite

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Banner)
admin.site.register(ConfigurationSite)