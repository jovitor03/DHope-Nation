# Generated by Django 5.1.3 on 2024-11-24 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DHopeNation', '0016_remove_donation_campaign_title_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='donor',
            name='donation_history',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]