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

    
    path('profile/donator/', views.profile_donator, name='profile_donator'),
    path('profile/donator/edit/', views.edit_profile, name='edit_donator_profile'),
    path('profile/donator/delete/', views.delete_account, name='delete_donator'),

   
    path('profile/campaign-creator/', views.profile_campaign_creator, name='profile_campaign_creator'),
    path('profile/campaign-creator/edit/', views.edit_profile, name='edit_campaign_creator_profile'),
    path('profile/campaign-creator/my-campaigns/', views.get_campaigns_by_creator, name='my_campaigns'),
    path('profile/campaign-creator/delete/', views.delete_account, name='delete_campaign_creator'),

    
    path('campaign/create/', views.create_campaign, name='create_campaign'),
    path('campaigns', views.get_campaigns, name='get_campaigns'),
    path('campaign/donate/', views.donate, name='donate_campaign'),
    path('campaign/upload-image/', views.upload_image, name='upload-image'),
    path('image/campaigns', views.get_images, name='get_images'),
    
    path('stats/donators/', views.donar_count, name='donar_count'),
    path('donators/', views.get_all_donators, name='get_all_donators'),
    path('campaign-creators/', views.get_all_campaign_creators, name='get_all_campaign_creators'),
    path('all-campaigns/', views.get_all_campaigns, name='get_all_campaigns'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)