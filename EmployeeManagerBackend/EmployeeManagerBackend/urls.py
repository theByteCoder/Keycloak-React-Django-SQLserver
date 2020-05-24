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
from django.urls import path
from rest_framework import routers

from Manager.views import *

router = routers.DefaultRouter()
router.register('Employees', EmployeesViews)

urlpatterns = [
    path('api/createEmployee/info=<str:info>', create_record),
    # path('api/employeesList/', get_record),
    path('api/searchEmployee/', get_record_all),
    path('api/searchEmployee/emp_no=<int:emp_no>/', get_record_single),
    path('api/searchEmployee/update/info=<str:info>', update_record),
    path('api/searchEmployee/delete/emp_no=<int:emp_no>/', delete_record),
    path('api/googleSearch/', google_search),
]
