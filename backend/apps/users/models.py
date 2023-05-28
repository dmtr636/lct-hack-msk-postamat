from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    @property
    def role(self):
        if self.is_superuser:
            return "root"
        elif self.is_staff:
            return "admin"
        return "user"
