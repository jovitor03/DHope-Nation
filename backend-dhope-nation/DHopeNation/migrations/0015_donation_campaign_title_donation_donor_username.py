# Generated by Django 5.1.3 on 2024-11-23 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DHopeNation', '0014_rename_total_donators_campaign_total_donors_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='donation',
            name='campaign_title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='donation',
            name='donor_username',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]