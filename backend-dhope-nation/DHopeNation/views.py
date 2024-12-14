import pytz
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserAccountSerializer, DonorSerializer, CampaignCreatorSerializer, CampaignSerializer, CampaignImageSerializer, DonationSerializer
from .models import UserAccount, Donor, CampaignCreator, Campaign, CampaignImage, Donation
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404, render
from django.db.models import Sum
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

#----------------------------------------------Account--------------------------------------------------------
@api_view(['POST'])
def register(request):
    serializer = UserAccountSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        if request.data.get('is_donor')==True or request.data.get('is_donor')=="true":
            donor_count = Donor.objects.count()+1
            Donor.objects.create(user=user, honor="Neutral Honor", rank=donor_count)
            
        elif request.data.get('is_campaign_creator')==True or request.data.get('is_campaign_creator')=="true":
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
def profile_donor(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user) 
        donor_serializer = DonorSerializer(donor)
        donations = Donation.objects.all().reverse().order_by('amount').filter(donor=donor)
        donation_serilazer=DonationSerializer(donations, many=True)
        return Response({"donor": donor_serializer.data,"donations_history": donation_serilazer.data},status=status.HTTP_200_OK) 
    else:
        return Response({"error": "User is not a donor"}, status=status.HTTP_400_BAD_REQUEST)
    
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
    donor_count = Donor.objects.count()
    return Response({"donor_count": donor_count}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        donor.delete()
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaign_creator.delete()
    user.delete()
    
    return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_donors(request):
    donors = Donor.objects.all()
    serializer = DonorSerializer(donors, many=True)
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
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        serializer = DonorSerializer(donor, data=request.data, partial=True)
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

@api_view(['GET'])
def get_top_donors(request):
    donors = Donor.objects.all().reverse().order_by('donation_value')
    serializer = DonorSerializer(donors, many=True)
    update_rank()
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_top_10_donors(request):
    donors = Donor.objects.all().reverse().order_by('donation_value')[:10]
    serializer = DonorSerializer(donors, many=True)
    update_rank()
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])

def get_top_10_donors_last_30_days(request):
    thirty_days_ago = datetime.now() - timedelta(days=30)
    donors = Donor.objects.all()
    donor_donations = []

    for donor in donors:
        total_donated = Donation.objects.filter(donor=donor, date__gte=thirty_days_ago).aggregate(total=Sum('amount'))['total'] or 0
        serializer = DonorSerializer(donor)
        donor_donations.append({'donor': serializer.data,'total_donated': total_donated})

    top_donors = sorted(donor_donations, key=lambda x: x['total_donated'], reverse=True)[:10]

    return Response(top_donors, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_type(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        return Response({"user_type": "Donor"}, status=status.HTTP_200_OK)
    elif user.is_campaign_creator:
        return Response({"user_type": "Campaign Creator"}, status=status.HTTP_200_OK)
    else:
        return Response({"user_type": "User"}, status=status.HTTP_200_OK)
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
    if campaign.is_verified:
        now_aware = datetime.now(pytz.utc)
        end_date_aware = campaign.end_date.astimezone(pytz.utc)
        if end_date_aware < now_aware:
            campaign.is_active = False
            campaign.save()
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
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_image(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaign_id = request.data.get('campaign_id')
        campaign = get_object_or_404(Campaign, id=campaign_id)
        if campaign.campaign_creator == campaign_creator:
            image = request.data.get('image')
            CampaignImage.objects.create(campaign=campaign, image=image)
            return Response({"message": "Image uploaded successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Campaign does not belong to the user"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "User is not a campaign creator"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_images(request):
    campaign_id = request.query_params.get('id')
    if not campaign_id:
        return Response({"error": "Campaign ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    campaign = get_object_or_404(Campaign, id=campaign_id)
    images = CampaignImage.objects.filter(campaign=campaign)
    serializer = CampaignImageSerializer(images, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_recently_campaigns (request):
    campaigns = Campaign.objects.filter(is_active=True).reverse().order_by('start_date')
    serializer = CampaignSerializer(campaigns, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_campaigns_higher_current_amount (request):
    campaigns = Campaign.objects.reverse().order_by('current_amount')
    serializer = CampaignSerializer(campaigns, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET']) 
def get_campaigns_by_category(request):
    category = request.data.get('category')
    campaigns = Campaign.objects.all()
    campaigns_category = []
    for campaign in campaigns:  
        campaign_category = campaign.category
        if all(word in campaign_category for word in category):
            serializer = CampaignSerializer(campaign)
            campaigns_category.append(serializer.data)
    return Response(campaigns_category, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_campaigns_by_title(request):
    title = request.data.get('title')
    if not title:
        return Response({"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)
    campaigns = Campaign.objects.filter(title__icontains=title)
    serializer = CampaignSerializer(campaigns, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def close_campain(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_campaign_creator:
        campaign_creator = get_object_or_404(CampaignCreator, user=user)
        campaign_id = request.data.get('campaign_id')
        campaign = get_object_or_404(Campaign, id=campaign_id)
        if campaign.campaign_creator == campaign_creator:
            campaign.is_completed = True
            campaign.is_active = False
            campaign.save()
            return Response({"message": "Campaign closed successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Campaign does not belong to the user"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "User is not a campaign creator"}, status=status.HTTP_400_BAD_REQUEST)
#-------------------------------------------------Donations---------------------------------------------------------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def donate(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        campaign_id = request.data.get('campaign_id')
        campaign = get_object_or_404(Campaign, id=campaign_id)
        amount = request.data.get('amount')
        if  amount > 0: 
            if donor.is_verified: 
                if campaign.is_verified and campaign.is_active:
                    goal=campaign.goal
                    if campaign.current_amount+amount<=goal:
                        campaign.current_amount += amount
                        campaign.total_donors += 1
                        campaign.save()
                        donor.donation_value += amount
                        donor.donation_count += 1
                        donor.xp += amount * 10
                        donor.save()
                    elif campaign.current_amount+amount>goal:
                        x=goal-campaign.current_amount
                        value=amount-x
                        if value>0:
                            amount=x
                            campaign.current_amount += amount
                            campaign.total_donors += 1
                            campaign.save()
                            donor.donation_value += amount
                            donor.donation_count += 1
                            donor.xp += amount * 10
                            donor.save()
                        else:
                            campaign.current_amount = goal
                            campaign.total_donors += 1
                            campaign.is_completed = True
                            campaign.save()
                            donor.donation_value += amount
                            donor.donation_count += 1
                            donor.xp += amount * 10
                            donor.save()
                    if campaign.current_amount == campaign.goal:
                        campaign.is_completed = True
                        campaign.is_active = False
                        campaign.save()
                    Donation.objects.create(donor=donor, campaign=campaign, amount=amount)
                    update_rank()

                    return Response({"message": "Donation made successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Campaign must be verified and active"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Donor must be verified"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({"error": "User must be a donor"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_last_donations(request):
    donations = Donation.objects.all().reverse().order_by('date')
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_top_donations(request):
    donations = Donation.objects.all().reverse().order_by('amount')
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_donations_by_donor(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        donations = Donation.objects.all().reverse().order_by('date').filter(donor=donor)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a donor"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_top_donations_by_donor(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        donations = Donation.objects.all().reverse().order_by('amount').filter(donor=donor)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a donor"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_donations_last_30_days(request):
    user = get_object_or_404(UserAccount, username=request.user.username)
    if user.is_donor:
        donor = get_object_or_404(Donor, user=user)
        
        thirty_days_ago = datetime.now() - timedelta(days=30)
   
        donations = Donation.objects.filter(donor=donor, date__gte=thirty_days_ago)
        total_donated = donations.aggregate(total=Sum('amount'))['total'] or 0
        return Response({"total_donated_last_30_days": total_donated}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not a donor"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_top_donations_last_30_days(request):
    thirty_days_ago = datetime.now() - timedelta(days=30)
    donations = Donation.objects.filter(date__gte=thirty_days_ago).reverse().order_by('amount')
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['GET'])
def get_top_10_donations_last_30_days(request):
    thirty_days_ago = datetime.now() - timedelta(days=30)
    donations = Donation.objects.filter(date__gte=thirty_days_ago).reverse().order_by('amount')[:10]
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#-------------------------------------------------Ranks---------------------------------------------------------------
def update_rank():
    donors = Donor.objects.all()
    donor_donations = []
    for donor in donors:
        total_donated = Donation.objects.filter(donor=donor).aggregate(total=Sum('amount'))['total'] or 0
        donor_donations.append({
            'donor': donor,
            'total_donated': total_donated
        })
    sorted_donors = sorted(donor_donations, key=lambda x: x['total_donated'], reverse=True)
    for rank, donor_data in enumerate(sorted_donors, start=1):
        donor = donor_data['donor']
        donor.rank = rank
        donor.save()

    return Response({"success": "Ranks updated successfully"}, status=status.HTTP_200_OK)

