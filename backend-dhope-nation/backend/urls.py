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
    re_path('profile/campign-creator',views.profile_campaign_creator),
    re_path('profile/campaign-creator/my_campaigns',views.get_campaigns_by_creator),
    re_path('campaign/create',views.create_campaign),
    re_path('campaign/get',views.get_campaigns),
    re_path('donator_get',views.donar_count),
   
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)