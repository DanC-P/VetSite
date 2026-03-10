from rest_framework import viewsets, permissions
from rest_framework.authentication import SessionAuthentication
from .models import Category, Product, Banner, ConfigurationSite
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    BannerSerializer, 
    ConfigurationSiteSerializer
)

# BaseViewSet para evitar repetição de código (DRY - Don't Repeat Yourself)
class BaseViewSet(viewsets.ModelViewSet):
    """
    Classe base para garantir que todos os ViewSets usem 
    a mesma autenticação e permissão.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProductViewSet(BaseViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BannerViewSet(BaseViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

class ConfigurationSiteViewSet(BaseViewSet):
    queryset = ConfigurationSite.objects.all()
    serializer_class = ConfigurationSiteSerializer