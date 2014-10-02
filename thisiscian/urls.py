from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^canvas/', include('canvas.urls')),
    url(r'^', include('main.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
