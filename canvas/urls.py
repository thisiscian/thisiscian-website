from django.conf.urls import patterns, include, url
from canvas import views

urlpatterns = patterns('',
	url(r'^/?$', views.index, name="home"),
	url(r'^(?P<type>[a-zA-Z-]+)/(?P<name>[a-zA-Z-]+)/?$', views.display, name='type-display'),
	url(r'^(?P<name>[a-zA-Z-]+)/?$', views.display, name='display'),
	url(r'^(?P<type>[a-zA-Z-]+)/(?P<name>[_.a-zA-Z-]+\.js)$', views.js, name='type-js'),
	url(r'^(?P<name>[_.a-zA-Z-]+\.js)$', views.js, name='js'),
)
