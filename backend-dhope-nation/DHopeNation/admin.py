from django.contrib import admin
from .models import Donor, CampaignCreator,UserAccount,Campaign,CampaignImage,Donation

admin.site.register(Donor)
admin.site.register(CampaignCreator)
admin.site.register(UserAccount)
admin.site.register(Campaign)
admin.site.register(CampaignImage)
admin.site.register(Donation)
# Register your models here.
