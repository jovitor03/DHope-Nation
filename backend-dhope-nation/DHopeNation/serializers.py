from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Donor, CampaignCreator, UserAccount, Campaign, CampaignImage, Donation

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name','is_campaign_creator', 'is_donor','date_joined','identification']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserAccount(**validated_data)
        user.set_password(password)
        user.save()
        return user

class DonorSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()
    class Meta:
        model = Donor
        fields = ['id','user','xp', 'donation_value', 'donation_count', 'honor', 'is_verified', 'level', 'rank', 'donation_history']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        donor = Donor.objects.create(user=user, **validated_data)
        return donor   
        
    
class CampaignCreatorSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()
    class Meta:
        model = CampaignCreator
        fields = ['id','user','is_verified']
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        campaign_creator = CampaignCreator.objects.create(user=user, **validated_data)
        return campaign_creator

class CampaignImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignImage
        fields = ['image']
    
    def create(self, validated_data):
        campaign = validated_data.pop('campaign')
        campaign_image = CampaignImage.objects.create(campaign=campaign, **validated_data)
        return campaign_image

class CampaignSerializer(serializers.ModelSerializer):
    campaign_creator = serializers.PrimaryKeyRelatedField(queryset=CampaignCreator.objects.all())
    category=serializers.JSONField()
    images = CampaignImageSerializer(many=True, read_only=True, source='campaignimage_set')
    
    class Meta:
        model = Campaign
        fields = ['id','campaign_creator', 'title', 'description', 'category', 'goal', 'current_amount', 'total_donors', 'start_date', 'end_date','ratio','sentence', 'is_verified', 'is_completed', 'is_active','images']
    
    def create(self, validated_data):
        campaign_creator = validated_data.pop('campaign_creator')
        campaign = Campaign.objects.create(campaign_creator=campaign_creator, **validated_data)
        return campaign
    
class DonationSerializer(serializers.ModelSerializer):
    donor = serializers.PrimaryKeyRelatedField(queryset=Donor.objects.all())
    campaign = serializers.PrimaryKeyRelatedField(queryset=Campaign.objects.all())
    username = serializers.CharField(source='donor.user.username', read_only=True)
    title = serializers.CharField(source='campaign.title', read_only=True)
    class Meta:
        model = Donation
        fields = ['id','donor','username','campaign','title','amount','date']
    
    def create(self, validated_data):
        donor = validated_data.pop('donor')
        campaign = validated_data.pop('campaign')
        donation = Donation.objects.create(donor=donor, campaign=campaign, **validated_data)
        return donation
    
