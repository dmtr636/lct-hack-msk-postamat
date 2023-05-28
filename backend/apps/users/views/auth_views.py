from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from apps.users.models import User
from apps.users.serializers import UserSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def auth_view(request: Request):
    user: User = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
def login_view(request: Request):
    email = request.data.get("email")
    password = request.data.get("password")
    user: User = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        raise AuthenticationFailed


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request: Request):
    logout(request)
    return Response({"result": "ok"})
