from django.contrib import admin
from .models import Donor, CampaignCreator,UserAccount,Campaign,CampaignImage,Donation


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'is_verified',)
    list_filter = ('is_verified',)
    list_editable = ('is_verified',)
    search_fields = ('user__username',)
@admin.register(CampaignCreator)
class CampaignCreatorAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'is_verified',)
    list_filter = ('is_verified',)
    list_editable = ('is_verified',)
    search_fields = ('user__username',)
@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('id','username','is_donor','is_campaign_creator','identification',)
    exclude = ('is_superuser','is_staff','groups','user_permissions',)
    search_fields = ('username',)
   
@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('id','campaign_creator__user','title', 'start_date','end_date','is_verified','is_completed','is_active',)
    list_filter = ('is_verified','is_completed','is_active',)
    list_editable = ('is_verified','is_completed','is_active',)
    search_fields = ('campaign_creator__user__username',)
@admin.register(CampaignImage)
class CampaignImageAdmin(admin.ModelAdmin):
    list_display = ('id','campaign__title','image',)
    search_fields = ('campaign__title',)

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id','donor__user','campaign__title','amount','date',)
    list_filter = ('date',)
    readonly_fields = ('date',)
    search_fields = ('donor__user__username',)

#admin.site.register(Donor)
#admin.site.register(CampaignCreator)
#admin.site.register(UserAccount)
#admin.site.register(Campaign)
#admin.site.register(CampaignImage)
#admin.site.register(Donation)
