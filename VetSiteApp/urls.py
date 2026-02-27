from django.urls import path, include
from .views import ProductViewSet, CategoryViewSet, BannerViewSet, ConfigurationSiteViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')
router.register('banners', BannerViewSet, basename='banner')
router.register('configuration', ConfigurationSiteViewSet, basename='configuration')

urlpatterns = [
    path('', include(router.urls)),
]