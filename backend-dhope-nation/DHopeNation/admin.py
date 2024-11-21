from django.contrib import admin
from .models import Donator, CampaignCreator,UserAccount,Campaign,CampaignImage

admin.site.register(Donator)
admin.site.register(CampaignCreator)
admin.site.register(UserAccount)
admin.site.register(Campaign)
admin.site.register(CampaignImage)

# Register your models here.
