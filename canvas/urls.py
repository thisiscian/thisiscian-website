from django.conf.urls import patterns, include, url
from canvas import views

urlpatterns = patterns('',
	url(r'^/?$', views.index, name="home"),
	url(r'^js/?(?P<type>[a-zA-Z]+)/?(?P<file>[a-zA-Z]+\.js)$', views.js, name='js'),
	url(r'^min/?(?P<type>[a-zA-Z]+)/?(?P<file>[a-zA-Z]+\.js)$', views.min, name='min'),
	url(r'^search/?$', views.search, name='search'),
	url(r'^search/?(?P<query>[a-zA-Z-]+)/?$', views.search, name='search'),
	url(r'^(?P<canvas_name>[a-zA-Z-]+)/?$', views.display, name='display'),
	url(r'^(?P<canvas_name>[a-zA-Z-]+)/(?P<adjustable>adjustable)/?$', views.display, name='display'),
)
