from django.contrib import admin

from apps.reviews.models import ReviewCategory, Review, ReviewSource


@admin.register(ReviewCategory)
class ReviewCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']
    ordering = ['id']


@admin.register(ReviewSource)
class ReviewCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']
    ordering = ['id']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    pass
