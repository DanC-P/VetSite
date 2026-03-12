from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, Banner, ConfigurationSite
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    BannerSerializer, 
    ConfigurationSiteSerializer
)
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator

# --- CONFIGURAÇÃO DE CSRF ---
@method_decorator(ensure_csrf_cookie, name='dispatch')    
class GetCSRFToken(APIView): # Corrigido: APIView é para ações simples
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'}, status=status.HTTP_200_OK)

# --- VIEWSETS (CRUD AUTOMÁTICO) ---
# Usar ModelViewSet permite que o Router crie rotas de Lista e Detalhe (ID) automaticamente.

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # O ModelViewSet já faz o GET, POST, PUT, PATCH e DELETE sozinho. 
    # Não precisa sobrescrever get() e post() a menos que queira lógica customizada.

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