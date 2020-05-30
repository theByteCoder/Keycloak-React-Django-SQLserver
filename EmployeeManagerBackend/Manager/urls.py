from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^secure$', views.secure, name='secure'),
    url(r'^openid/logout', views.keycloak_logout, name='logoutKeycloak'),
]
