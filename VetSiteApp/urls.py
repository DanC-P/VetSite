from django.urls import path
from .views import (
    ProductViewSet, 
    CategoryViewSet, 
    BannerViewSet, 
    ConfigurationSiteViewSet,
    GetCSRFToken # Sua view de CSRF
)

urlpatterns = [
    # Rota para pegar o Token CSRF (essencial para o React)
    path('csrf_cookie/', GetCSRFToken.as_view(), name='csrf_cookie'),
    
    # Rotas manuais para cada API
    path('products/', ProductViewSet.as_view(), name='product-list'),
    path('categories/', CategoryViewSet.as_view(), name='category-list'),
    path('banners/', BannerViewSet.as_view(), name='banner-list'),
    path('configuration/', ConfigurationSiteViewSet.as_view(), name='configuration-detail'),
]