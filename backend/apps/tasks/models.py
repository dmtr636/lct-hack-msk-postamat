from django.db import models

from apps.reviews.models import Review, ReviewCategory


class TaskCategory(models.Model):
    review_category = models.OneToOneField(ReviewCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    @property
    def review_category_name(self):
        return self.review_category.name

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория задачи"
        verbose_name_plural = "Категории задач"


class Task(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    category = models.ForeignKey(TaskCategory, null=True, default=None, on_delete=models.CASCADE)
    review = models.OneToOneField(Review, on_delete=models.CASCADE)
    created_at = models.DateTimeField()

    class TaskStatus(models.TextChoices):
        OPEN = "open"
        IN_PROGRESS = "in_progress"
        ARCHIVE = "archive"

    status = models.CharField(max_length=255, choices=TaskStatus.choices, default=TaskStatus.OPEN)

    class Meta:
        indexes = [
            models.Index(fields=['status', ]),
        ]

