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
from django.conf import settings

# --- ENVIO DE EMAIL ---
# NOTA DE SEGURANÇA: Devido às políticas de SPF/DKIM dos provedores de e-mail, 
# não é possível usar o e-mail do cliente no campo 'From'. 
# O envio é feito via e-mail do proprietário, e o e-mail do cliente 
# é inserido no campo 'reply_to' para permitir a resposta direta.
@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact(request):
    config = ConfigurationSite.objects.first()

    
    if not config or not config.email_contact:
        return Response({"error": "O e-mail de destino não foi configurado pelo administrador."}, 
            status=400
        )
    
    # Captura os dados do input
    user_email = request.data.get('email')
    user_name = request.data.get('name')
    user_subject = request.data.get('subject')
    user_message = request.data.get('message')
    
    if not all([user_email, user_name, user_subject, user_message]):
        return Response({"error": "Todos os campos são obrigatórios."}, 
            status=400
    )
    
    # Montamos um corpo de e-mail mais
    full_message = f"Nome: {user_name}\nE-mail do Cliente: {user_email}\n\nMensagem:\n{user_message}"

    try:

        print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
        print("EMAIL_HOST_PASSWORD:", settings.EMAIL_HOST_PASSWORD)

        email = EmailMessage(
            subject=f"[CONTATO VETSITE] - {user_subject}",
            body=full_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[config.email_contact],
            reply_to=[user_email],
        )
        email.send(fail_silently=False)
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



class ConfigurationSiteViewSet(viewsets.ModelViewSet):
    queryset = ConfigurationSite.objects.all()
    serializer_class = ConfigurationSiteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]