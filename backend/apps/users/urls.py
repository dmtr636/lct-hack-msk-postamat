from django.urls import path, include
from rest_framework import routers

from apps.users.views.auth_views import login_view, logout_view, auth_view
from apps.users.views.users_views import UserViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('users', UserViewSet)

urlpatterns = [
    path('admin/login', login_view),
    path('admin/logout', logout_view),
    path('admin/auth', auth_view),
    path('admin/', include(router.urls))
]
