from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserAccountSerializer, DonatorSerializer, CampaignCreatorSerializer, CampaignSerializer
from .models import UserAccount, Donator, CampaignCreator, Campaign
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404, render
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
#----------------------------------------------Account--------------------------------------------------------
@api_view(['POST'])
def register(request):
    serializer = UserAccountSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        if request.data.get('is_donator'):
            Donator.objects.create(user=user)
        elif request.data.get('is_campaign_creator'):
            CampaignCreator.objects.create(user=user)

        token = Token.objects.create(user=user)
        return Response({'token': token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(UserAccount, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserAccountSerializer(instance=user)

    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_donator(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donator:
        donator = get_object_or_404(Donator, user=user)
        
        donator_serializer = DonatorSerializer(donator)
        return Response({
            "donator": donator_serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a donator"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_campaign_creator(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaign_creator_serializer = CampaignCreatorSerializer(campaign_creator)
        return Response({
            "campaign_creator": campaign_creator_serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a campaign creator"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def donar_count(request):
    donator_count = Donator.objects.count()
    return Response({"donator_count": donator_count}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    
    # Eliminar relaciones asociadas
    if user.is_donator:
        donator = get_object_or_404(Donator, user=user)
        donator.delete()
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaign_creator.delete()
    
    # Eliminar la cuenta del usuario
    user.delete()
    
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_donators(request):
    donators = Donator.objects.all()
    serializer = DonatorSerializer(donators, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
def get_all_campaign_creators(request):
    campaign_creators = CampaignCreator.objects.all()
    serializer = CampaignCreatorSerializer(campaign_creators, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donator:
        donator = get_object_or_404(Donator, user=user)
        serializer = DonatorSerializer(donator, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        serializer = CampaignCreatorSerializer(campaign_creator, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#------------------------------------------------Campaigns-----------------------------------------------------------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_campaign(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        request.data['campaign_creator'] = campaign_creator.id
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "User is not a campaign creator"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_campaigns(request):
    campaign_id = request.query_params.get('id')
    if not campaign_id:
        return Response({"error": "Campaign ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    campaign = get_object_or_404(Campaign, id=campaign_id)
    serializer = CampaignSerializer(campaign)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_campaigns_by_creator(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaigns = Campaign.objects.filter(campaign_creator=campaign_creator)
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a campaign creator"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_all_campaigns(request):
    campaigns = Campaign.objects.all()
    serializer = CampaignSerializer(campaigns, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#-------------------------------------------------Donations---------------------------------------------------------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def donate(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donator:
        donator = get_object_or_404(Donator, user=user)
        campaign_id = request.data.get('campaign_id')
        amount = request.data.get('amount')
        campaign = get_object_or_404(Campaign, id=campaign_id)

        if campaign.is_active and campaign.is_verified:
            campaign.current_amount += amount
            campaign.total_donators += 1
            campaign.save()
            donator.donation_value += amount
            donator.donation_count += 1
            donator.xp += amount * 10
            donator.save()
            return Response({"message": "Donation successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Campaign is not active or verified"}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({"error": "User is not a donator"}, status=status.HTTP_400_BAD_REQUEST)