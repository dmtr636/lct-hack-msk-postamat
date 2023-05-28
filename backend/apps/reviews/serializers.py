from rest_framework.relations import PrimaryKeyRelatedField, SlugRelatedField
from rest_framework.serializers import ModelSerializer
from rest_framework.fields import DateTimeField

from apps.reviews.models import Review, ReviewCategory


class ReviewCategorySerializer(ModelSerializer):
    class Meta:
        model = ReviewCategory
        fields = ['id', 'name']


class ReviewSerializer(ModelSerializer):
    category_ids = PrimaryKeyRelatedField(source='categories', many=True, read_only=True)
    categories = SlugRelatedField(many=True, read_only=True, slug_field='name')
    postamat_id = PrimaryKeyRelatedField(source='postamat', read_only=True)
    postamat_address = SlugRelatedField(source='postamat', read_only=True, slug_field='address')
    date = DateTimeField(read_only=True, format="%d.%m.%Y")
    source_id = PrimaryKeyRelatedField(source='source', read_only=True)
    source_name = SlugRelatedField(source='source', read_only=True, slug_field='name')

    class Meta:
        model = Review
        fields = ['id', 'comment', 'rating', 'date', 'source_id', 'source_name', 'postamat_id',
                  'postamat_address', 'user_name', 'user_phone', 'categories', 'category_ids']
