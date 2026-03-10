from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView

urlpatterns = [
    # 1. Painel Administrativo
    path('admin/', admin.site.urls),

    # 2. Suas APIs (Produtos, Categorias, etc)
    path('api/', include('VetSiteApp.urls')),

    # 3. Autenticação padrão do DRF (Essencial para o Login via React)
    path('api-auth/', include('rest_framework.urls')),

    # 4. ENTREGA O REACT: Qualquer rota que não seja /admin ou /api 
    # vai carregar o index.html do seu build do React.
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

# Servir arquivos de mídia (imagens dos produtos) em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)