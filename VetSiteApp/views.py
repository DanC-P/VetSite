from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets, permissions

from .models import Category, Product, Banner, ConfigurationSite
from .serializers import CategorySerializer, ProductSerializer, BannerSerializer, ConfigurationSiteSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ConfigurationSiteViewSet(viewsets.ModelViewSet):
    queryset = ConfigurationSite.objects.all()
    serializer_class = ConfigurationSiteSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]