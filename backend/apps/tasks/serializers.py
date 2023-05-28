from rest_framework.fields import DateTimeField
from rest_framework.relations import PrimaryKeyRelatedField, SlugRelatedField
from rest_framework.serializers import ModelSerializer

from apps.reviews.serializers import ReviewSerializer
from apps.tasks.models import Task, TaskCategory


class TaskCategorySerializer(ModelSerializer):
    review_category_id = PrimaryKeyRelatedField(source='review_category', read_only=True)

    class Meta:
        model = TaskCategory
        fields = ['id', 'name', 'review_category_id']


class TaskSerializer(ModelSerializer):
    review = ReviewSerializer()
    created_at = DateTimeField(read_only=True, format="%d.%m.%Y")
    name = SlugRelatedField(source='category', slug_field="name", read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'review', 'created_at', 'status']
