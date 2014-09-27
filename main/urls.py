from django.conf.urls import patterns, include, url
from main import views

urlpatterns = patterns('',
		url(r'^about', views.about, name="about"),
		url(r'^/?$', views.index, name="home"),
)
