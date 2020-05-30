"""EmployeesManager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

from Manager.views import *

router = routers.DefaultRouter()
router.register('Employees', EmployeesViews)

urlpatterns = [
    url('api/searchEmployee/create/info=<str:info>/', create_record),
    # path('api/employeesList/', get_record),
    url('api/searchEmployee/', get_record_all),
    url('api/searchEmployee/emp_no=<int:emp_no>/', get_record_single),
    url('api/searchEmployee/update/info=<str:info>/', update_record),
    url('api/searchEmployee/delete/emp_no=<int:emp_no>/', delete_record),
    url('api/googleSearch/', google_search),
    url(r'', include('Manager.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'openid/', include('djangooidc.urls')),
]
