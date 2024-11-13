from django.db import models
from django.contrib.auth.models import User

class UserAccount(User):
    is_donator = models.BooleanField(default=False)
    is_campaign_creator = models.BooleanField(default=False)

class Donator(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE)
    xp = models.IntegerField(default=0)
    donation_value = models.FloatField(default=0)
    donation_count = models.IntegerField(default=0)
    honor = models.CharField(max_length=100, default='Neutral Honor')
    is_verified = models.BooleanField(default=False)
    level = models.IntegerField(default=1)
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
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if self.user.is_donator:
            #raise ValueError("A Donator cannot be a Campaign Creator")
            self.user.is_donator = True
        self.user.is_campaign_creator = True
        self.user.save()
        super().save(*args, **kwargs)
    
class Campaign(models.Model):
    campaign_creator = models.ForeignKey(CampaignCreator, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.TextField(default='[]')
    goal = models.FloatField()
    current_amount = models.FloatField(default=0)
    total_donators = models.IntegerField(default=0)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    ratio = models.IntegerField(default=0)
    sentence = models.CharField(max_length=100, default='No sentence')    
    is_verified = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.campaign_creator.is_verified:
            raise ValueError("Campaign Creator must be verified")
        super().save(*args, **kwargs)
    def change_status(self):
        if self.is_completed:
            self.is_active = False
        else:
            self.is_active = True
    def change_title(self, new_title):
        self.title = new_title
    def change_description(self, new_description):
        self.description = new_description
    def select_category(self, category):
        self.category.append(category)
    def change_goal(self, new_goal):
        self.goal = new_goal
    def change_end_date(self, new_end_date):
        self.end_date = new_end_date
    def verify_campaign(self):
        self.is_verified = True
    def complete_campaign(self):
        self.is_completed = True
        self.is_active = False
    

    
