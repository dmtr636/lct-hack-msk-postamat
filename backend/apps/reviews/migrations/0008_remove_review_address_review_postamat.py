# Generated by Django 4.1.7 on 2023-05-25 22:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houses', '0002_region_district_house_district'),
        ('reviews', '0007_remove_reviewcategory_task_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='address',
        ),
        migrations.AddField(
            model_name='review',
            name='postamat',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='houses.house'),
        ),
    ]
