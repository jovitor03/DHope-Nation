from django.db import models
from django.contrib.auth.models import User

class UserAccount(User):
    is_donator = models.BooleanField(default=False)
    is_campaign_creator = models.BooleanField(default=False)

class Donator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    xp = models.IntegerField(default=0)
    donaiton_value = models.IntegerField(default=0)
    donation_count = models.IntegerField(default=0)
    honor = models.CharField(max_length=100, default='neutral honor')
    is_verified = models.BooleanField(default=False)
    level = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    donation_history = models.TextField(default='[]')
    
    def save(self, *args, **kwargs):
        if self.user.is_campaign_creator:
            #raise ValueError("A Campaign Creator cannot be a Donator")
            self.user.is_campaign_creator = False
        self.user.is_donator = True
        self.user.save()
        super().save(*args, **kwargs)
    
class CampaignCreator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if self.user.is_donator:
            #raise ValueError("A Donator cannot be a Campaign Creator")
            self.user.is_donator = True
        self.user.is_campaign_creator = True
        self.user.save()
        super().save(*args, **kwargs)
    
    
