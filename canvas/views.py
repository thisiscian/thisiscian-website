from django.shortcuts import render
from django.http import HttpResponse
from canvas.models import Canvas
from slimit import minify
import os
import os.path
from django.conf import settings

APP_ROOT=os.path.abspath(os.path.dirname(__file__))

def findType(name):
	subdirs=os.walk(os.path.join(APP_ROOT,"js"))
	for root,subdirs,files in subdirs:
		if root.split("/")[-1] == "js":
			continue
		if name+".js" in files:
			return root.split("/")[-1]
	return None

def index(request):
	return render(request, 'canvas/home.html', {"title":"home"})

def display(request, name=None, type=None, adjustable=None):
	if type is None:
		type=findType(name)
	if type is None:
		return render(request, 'canvas/lost.html', {"canvas":name})
	return render(request, 'canvas/display.html', {"title":"display", "type": type, "canvas":name, "adjustable":adjustable})
		
def js(request, name, type=None):
	if type is None:
		type=findType(name)
	utilOut=open(os.path.join(APP_ROOT,"js","utilities.js")).read()
	typeOut=open(os.path.join(APP_ROOT,'js',type+".js")).read()
	nameOut=open(os.path.join(APP_ROOT,'js',type,name)).read()
	if name[0] is "_":
		return HttpResponse(nameOut,content_type='script/javascript')
	return HttpResponse(utilOut+"\n"+typeOut+"\n"+nameOut,content_type='script/javascript')
