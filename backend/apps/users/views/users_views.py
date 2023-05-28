from smtplib import SMTPException

from django.db import transaction
from rest_framework import mixins
from rest_framework import status
from rest_framework.exceptions import ValidationError, APIException
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.users.models import User
from apps.users.serializers import UserSerializer
from django.core.mail import send_mail


class SendMailError(APIException):
    status_code = 500
    default_detail = 'Не удалось отправить сообщение с паролем на указанный email'
    default_code = 'send_mail_error'


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet
):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        request_user: User = request.user
        email = request.data.get('email')
        role = request.data.get('role')
        name = request.data.get('name')

        if None in [email, role, name]:
            raise ValidationError('email, role, name обязательные поля')

        if role not in ['admin', 'user']:
            raise ValidationError('role может принимать только значения admin и user')

        if role == 'admin' and not request_user.is_superuser:
            raise ValidationError('Администратор может быть создан только суперпользователем')

        if User.objects.filter(username=email).exists():
            raise ValidationError('Такой пользователь уже существует')

        password = User.objects.make_random_password()
        is_staff = role == 'admin'
        new_user = User.objects.create_user(username=email, password=password, first_name=name, is_staff=is_staff)
        serializer = self.get_serializer(new_user)

        try:
            send_mail(
                "Регистрация аккаунта на msk-postamat.ru",
                f"Данные Вашего аккаунта: \n\nПочта: {email}\nПароль: {password}",
                "no-reply@msk-postamat.ru",
                [email],
                fail_silently=False,
            )
        except SMTPException:
            raise SendMailError

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        request_user: User = request.user
        user = self.get_object()

        if user.role == "root":
            raise ValidationError('Невозможно удалить суперпользователя')

        if user.role == "admin" and request_user.role != "root":
            raise ValidationError('Администратор может быть удалён только суперпользователем')

        user.delete()
        return Response({'result': 'ok'})
