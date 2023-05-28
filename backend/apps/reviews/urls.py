from django.urls import path, include
from rest_framework import routers

from apps.reviews.views import import_dataset_view, ReviewCategoryViewSet, ReviewViewSet, add_review_view

reviews_router = routers.DefaultRouter(trailing_slash=False)
reviews_router.register('reviews', ReviewViewSet)

review_categories_router = routers.DefaultRouter(trailing_slash=False)
review_categories_router.register('review-categories', ReviewCategoryViewSet)

urlpatterns = [
    path('admin/reviews/import-dataset', import_dataset_view),
    path('admin/', include(reviews_router.urls)),
    path('admin/', include(review_categories_router.urls)),
    path('reviews', add_review_view)
]
