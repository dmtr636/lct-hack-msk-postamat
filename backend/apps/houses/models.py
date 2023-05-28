from django.db import models


class Region(models.Model):
    name = models.CharField(max_length=255)


class District(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)


class House(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    address = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.CASCADE, null=True, default=None)

