from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include("apps.users.urls")),
    path('api/', include("apps.reviews.urls")),
    path('api/', include("apps.houses.urls")),
    path('api/', include("apps.tasks.urls"))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
