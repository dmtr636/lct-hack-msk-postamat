from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer

from apps.users.models import User


class UserSerializer(ModelSerializer):
    email = CharField(source="username")
    name = CharField(source="first_name")

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role']
