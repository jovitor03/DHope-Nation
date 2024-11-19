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
    re_path('login',views.login),
    re_path('register',views.register),
    re_path('profile/donator',views.profile_donator),
    re_path('donator/delete',views.delete_account),#BRO esta aqui o delete do donator
    re_path('profile/donator/edit',views.edit_profile),
    re_path('profile/campign-creator',views.profile_campaign_creator),
    re_path('profile/campaign-creator/edit',views.edit_profile),
    re_path('profile/campaign-creator/my_campaigns',views.get_campaigns_by_creator),
    re_path('campaign-creator/delete',views.delete_account), #BRO esta aqui o delete do campaign creator
    re_path('campaign/create',views.create_campaign),
    re_path('campaign/get',views.get_campaigns),
    re_path('donator_get',views.donar_count),
    re_path('campaign/donate',views.donate),#BRO esta qui o donate
    re_path('get_all_donators',views.get_all_donators),
    re_path('get_all_campaign_creators',views.get_all_campaign_creators),
    re_path('get_all_campaigns',views.get_all_campaigns),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)