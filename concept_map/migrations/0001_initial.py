# Generated by Django 4.1.4 on 2022-12-20 21:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(default='', max_length=256)),
                ('connections', models.ManyToManyField(blank=True, to='concept_map.node')),
            ],
        ),
    ]
