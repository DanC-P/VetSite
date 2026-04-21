from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
from VetSiteApp.views import send_contact

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('VetSiteApp.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/send_contact/', send_contact, name='send_contact'),
]

# 1º: Adiciona os arquivos de mídia (Imagens)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 2º: O React vem por ÚLTIMO de tudo
urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]