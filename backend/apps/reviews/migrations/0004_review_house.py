# Generated by Django 4.1.7 on 2023-05-23 09:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houses', '0001_initial'),
        ('reviews', '0003_alter_review_options_alter_reviewcategory_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='house',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='houses.house'),
        ),
    ]
