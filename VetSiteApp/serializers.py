from rest_framework import serializers
from .models import Category, Product, Banner, ConfigurationSite

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id',
                  'name',
                  'slug',
                  'icon_name']

class ProductSerializer(serializers.ModelSerializer):

    fr_group = CategorySerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True) 
    fr_group_id = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(), source='fr_group', write_only=True
    )

    class Meta:
        model = Product
        fields = ['id',
                  'title',
                  'slug',
                  'description',
                  'price',
                  'old_price',
                  'stock_quantity',
                  'image',
                  'fr_group',
                  'fr_group_id',
                  'is_active']


class BannerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Banner
        fields = ['id',
                  'image',
                  'title',
                  'link',
                  'is_active']

class ConfigurationSiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConfigurationSite
        fields = ['id',
                  'title_site',
                  'logo',
                  'whatsapp_number',
                  'default_message',
                  'email_contact']
