from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import (
    ProductViewSet, 
    CategoryViewSet,  
    ConfigurationSiteViewSet,
    GetCSRFToken
)

# O Router mapeia automaticamente as ações do ViewSet (list, create, update, destroy)
router = SimpleRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'configuration', ConfigurationSiteViewSet, basename='configuration')

urlpatterns = [
    # Rota para o Token CSRF
    path('csrf_cookie/', GetCSRFToken.as_view(), name='csrf_cookie'),
    
    # Inclui as rotas geradas pelo router
    path('', include(router.urls)),
]