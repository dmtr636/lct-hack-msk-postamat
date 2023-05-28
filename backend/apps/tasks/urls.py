from django.urls import path, include
from rest_framework import routers

from apps.tasks.views import TaskViewSet, TaskCategoryViewSet

tasks_router = routers.DefaultRouter(trailing_slash=False)
tasks_router.register('tasks', TaskViewSet)

task_categories_router = routers.DefaultRouter(trailing_slash=False)
task_categories_router.register('task-categories', TaskCategoryViewSet)

urlpatterns = [
    path('admin/', include(tasks_router.urls)),
    path('admin/', include(task_categories_router.urls))
]
