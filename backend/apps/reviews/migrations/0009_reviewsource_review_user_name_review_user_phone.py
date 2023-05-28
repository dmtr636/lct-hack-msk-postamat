# Generated by Django 4.1.7 on 2023-05-27 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0008_remove_review_address_review_postamat'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewSource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'Источник отзыва',
                'verbose_name_plural': 'Источники отзывов',
            },
        ),
        migrations.AddField(
            model_name='review',
            name='user_name',
            field=models.CharField(default=None, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='review',
            name='user_phone',
            field=models.CharField(default=None, max_length=255, null=True),
        ),
    ]
