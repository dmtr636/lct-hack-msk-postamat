from django.contrib import admin

from apps.tasks.models import TaskCategory


@admin.register(TaskCategory)
class ReviewCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'review_category_name']
