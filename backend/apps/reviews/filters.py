from django_filters import rest_framework, NumberFilter

from apps.reviews.models import Review


class ReviewFilter(rest_framework.FilterSet):
    min_rating = NumberFilter(field_name="rating", lookup_expr='gte')
    max_rating = NumberFilter(field_name="rating", lookup_expr='lte')
    category_id = NumberFilter(field_name='categories')

    class Meta:
        model = Review
        fields = ['rating', 'category_id', 'id', 'date']
