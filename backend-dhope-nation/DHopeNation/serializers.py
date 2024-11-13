from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Donator, CampaignCreator, UserAccount, Campaign

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name','is_campaign_creator', 'is_donator','date_joined']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserAccount(**validated_data)
        user.set_password(password)
        user.save()
        return user

class DonatorSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()
    class Meta:
        model = Donator
        fields = ['user','xp', 'donation_value', 'donation_count', 'honor', 'is_verified', 'level', 'rank', 'donation_history']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        donator = Donator.objects.create(user=user, **validated_data)
        return donator   
        
    
class CampaignCreatorSerializer(serializers.ModelSerializer):
    user=UserAccountSerializer()
    class Meta:
        model = CampaignCreator
        fields = ['user','is_verified']
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        campaign_creator = CampaignCreator.objects.create(user=user, **validated_data)
        return campaign_creator

class CampaignSerializer(serializers.ModelSerializer):
    campaign_creator = serializers.PrimaryKeyRelatedField(queryset=CampaignCreator.objects.all())
    class Meta:
        model = Campaign
        fields = ['campaign_creator', 'title', 'description', 'category', 'goal', 'current_amount', 'total_donators', 'start_date', 'end_date','ratio','sentence', 'is_verified', 'is_completed', 'is_active']
    
    def create(self, validated_data):
        campaign_creator = validated_data.pop('campaign_creator')
        campaign = Campaign.objects.create(campaign_creator=campaign_creator, **validated_data)
        return campaign

    