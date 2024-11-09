from django.contrib import admin
from .models import Donator, CampaignCreator,UserAccount

admin.site.register(Donator)
admin.site.register(CampaignCreator)
admin.site.register(UserAccount)


# Register your models here.
