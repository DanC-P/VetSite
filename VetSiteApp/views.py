from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, Banner, ConfigurationSite
from django.db.models import Count, Sum
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    BannerSerializer, 
    ConfigurationSiteSerializer
)
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail

# --- ENVIO DE EMAIL ---

@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact(request):
    config = ConfigurationSite.objects.first()

    if not config or not config.email_contact:
        return Response({"error": "O e-mail de destino não foi configurado pelo administrador."}, 
            status=400
        )
    
    user_email = request.data.get('email')
    user_name = request.data.get('name')
    user_subject = request.data.get('subject')
    user_message = request.data.get('message')
    
    try:
        send_mail(
            subject= user_subject,
            message=user_message,
            from_email=user_email,
            recipient_list=[config.email_contact],
            fail_silently=False,
        )
        return Response({"success": "E-mail enviado com sucesso."}, status=200)
    
    except Exception as e:
        return Response({"error": f"Erro ao enviar e-mail: {str(e)}"}, status=500)

# --- CONFIGURAÇÃO DE CSRF ---
@method_decorator(ensure_csrf_cookie, name='dispatch')    
class GetCSRFToken(APIView): # Corrigido: APIView é para ações simples
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'}, status=status.HTTP_200_OK)

# --- VIEWSETS (CRUD AUTOMÁTICO) ---
# Usar ModelViewSet permite que o Router crie rotas de Lista e Detalhe (ID) automaticamente.

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Product.objects.all()

        is_home = self.request.query_params.get('home')
        if is_home:
            return queryset.filter(is_featured=True, is_active=True, stock_quantity__gt=0)
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(product_count=Count('products')) # Adiciona contagem de produtos
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