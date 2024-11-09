from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserAccountSerializer, DonatorSerializer, CampaignCreatorSerializer
from .models import UserAccount, Donator, CampaignCreator
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404, render
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

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
