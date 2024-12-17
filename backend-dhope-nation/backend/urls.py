"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from DHopeNation import views
urlpatterns = [
    path('admin/', admin.site.urls),
    
    
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('user-type/', views.get_user_type, name='user_type'),

    
    path('profile/donor/', views.profile_donor, name='profile_donor'),
    path('profile/donor/edit/', views.edit_profile, name='edit_donor_profile'),
    path('profile/donor/my-donations/', views.get_donations_by_donor, name='my_donations'),
    path('profile/donor/my-top-donations/', views.get_top_donations_by_donor, name='my_top_donations'),
    path('profile/donor/delete/', views.delete_account, name='delete_donor'),
    
   
    path('profile/campaign-creator/', views.profile_campaign_creator, name='profile_campaign_creator'),
    path('profile/campaign-creator/edit/', views.edit_profile, name='edit_campaign_creator_profile'),
    path('profile/campaign-creator/my-campaigns/', views.get_campaigns_by_creator, name='my_campaigns'),
    path('profile/campaign-creator/delete/', views.delete_account, name='delete_campaign_creator'),

    
    path('campaign/create/', views.create_campaign, name='create_campaign'),
    path('campaigns', views.get_campaigns, name='get_campaigns'),
    path('campaign/donate/', views.donate, name='donate_campaign'),
    path('campaign/upload-image/', views.upload_image, name='upload-image'),
    path('image/campaigns', views.get_images, name='get_images'),
    path('close-campaign/', views.close_campain, name='close_campaign'),
    
    path('stats/donors/', views.donar_count, name='donar_count'),
    path('donors/', views.get_all_donors, name='get_all_donors'),
    path('campaign-creators/', views.get_all_campaign_creators, name='get_all_campaign_creators'),
    path('all-campaigns/', views.get_all_campaigns, name='get_all_campaigns'),
    path('campaigns-higher-current-amount/', views.get_campaigns_higher_current_amount, name='higher-current-amount'),
    path('recently-campaigns-create/', views.get_recently_campaigns, name='new-campaigns'),
    path('last-donations/', views.get_last_donations, name='last-donation'),
    path('top-donations/', views.get_top_donations, name='top-donation'),
    path('top-donors/', views.get_top_donors, name='top-donors'),
    path('top-10-donors/', views.get_top_10_donors, name='top-10-donors'),
    path('top-10-donors-last-30-days/', views.get_top_10_donors_last_30_days, name='top-10-donors-last-30-days'),
    path('campaigns-by-category/', views.get_campaigns_by_category, name='campaigns-by-category'),
    path('campaigns-by-title/', views.get_campaigns_by_title, name='campaigns-by-title'),
    path('donations/last-30-days/', views.get_donations_last_30_days, name='get_donations_last_30_days'),
    path('top-donations-last-30-days/', views.get_top_donations_last_30_days, name='top-10-donations-last-30-days'),
    path('top-10-donation-last-30-days/', views.get_top_10_donations_last_30_days, name='top-10-donations-last-30-days'),

    path('check-if-token-exists/<str:token>/', views.check_if_token_exists, name='check-if-token-exists'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)