from django.urls import path, include
from rest_framework import routers

from apps.houses.views import import_house_registry_view, HouseViewSet, RegionViewSet, DistrictViewSet

houses_router = routers.DefaultRouter(trailing_slash=False)
houses_router.register('postamats', HouseViewSet)

regions_router = routers.DefaultRouter(trailing_slash=False)
regions_router.register('regions', RegionViewSet)

districts_router = routers.DefaultRouter(trailing_slash=False)
districts_router.register('districts', DistrictViewSet)

urlpatterns = [
    path('admin/postamats/import-registry', import_house_registry_view),
    path('admin/', include(houses_router.urls)),
    path('admin/', include(districts_router.urls)),
    path('admin/', include(regions_router.urls))
]
