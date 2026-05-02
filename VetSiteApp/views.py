from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, ConfigurationSite
from django.db.models import Count, Sum
from .serializers import (
    CategorySerializer, 
    ProductSerializer,  
    ConfigurationSiteSerializer
)
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.core.mail import EmailMessage
import resend
from django.conf import settings

# --- ENVIO DE EMAIL ---
# NOTA DE SEGURANÇA: Devido às políticas de SPF/DKIM dos provedores de e-mail, 
# não é possível usar o e-mail do cliente no campo 'From'. 
# O envio é feito via e-mail do proprietário, e o e-mail do cliente 
# é inserido no campo 'reply_to' para permitir a resposta direta.
@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact(request):

    try:

        print("INICIOU VIEW")

        resend.api_key = settings.RESEND_API_KEY

        print("API KEY:", bool(settings.RESEND_API_KEY))

        response = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": ["danielsantoscosta16@gmail.com"],
            "subject": "Teste Railway",
            "text": "Teste envio Resend"
        })

        print("RESPOSTA RESEND:", response)

        return Response({
            "success": True,
            "response": str(response)
        })

    except Exception as e:

        print("ERRO REAL:", repr(e))

        return Response({
            "error": str(e),
            "type": type(e).__name__
        }, status=500)

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



class ConfigurationSiteViewSet(viewsets.ModelViewSet):
    queryset = ConfigurationSite.objects.all()
    serializer_class = ConfigurationSiteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]