from django.db import models

from apps.houses.models import House


class ReviewCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория отзыва"
        verbose_name_plural = "Категории отзывов"


class ReviewSource(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Источник отзыва"
        verbose_name_plural = "Источники отзывов"


class Review(models.Model):
    comment = models.TextField()
    date = models.DateTimeField()
    rating = models.PositiveSmallIntegerField()
    categories = models.ManyToManyField(ReviewCategory)
    source = models.ForeignKey(ReviewSource, null=True, default=None, on_delete=models.CASCADE)
    postamat = models.ForeignKey(House, null=True, default=None, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255, null=True, default=None)
    user_phone = models.CharField(max_length=255, null=True, default=None)

    def __str__(self):
        return f"Отзыв №{self.id}"

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"

