from django.contrib import admin
from .models import Donator, CampaignCreator,UserAccount,Campaign

admin.site.register(Donator)
admin.site.register(CampaignCreator)
admin.site.register(UserAccount)
admin.site.register(Campaign)

# Register your models here.
