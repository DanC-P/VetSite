from django.db import models

class Product(models.Model):
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='products/')
    fr_group = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    old_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Category (models.Model):
    name = models.CharField(max_length=300)
    slug = models.SlugField(unique=True, null=True, blank=True)
    cap_image = models.ImageField(upload_to='category/')
    icon_name = models.CharField(max_length=50, default='Dog')

    def __str__(self):
        return self.name

class Banner (models.Model):
    image = models.ImageField(upload_to='banners/')
    title = models.CharField(max_length=300)
    link = models.URLField(max_length=200, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class ConfigurationSite(models.Model):
    title_site = models.CharField(max_length=300, null=True, blank=True)
    logo = models.ImageField(upload_to='config/', null=True, blank=True)
    whatsapp_number = models.CharField(max_length=20, null=True, blank=True)
    default_mensage = models.CharField(max_length=300, null=True, blank=True)
    email_contact = models.EmailField(max_length=254, null=True, blank=True)

    def __str__(self):
        return "Configuração Geral do Site"

