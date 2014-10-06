from django.shortcuts import render
from django.http import HttpResponse
from canvas.models import Canvas
from slimit import minify
import os
from django.conf import settings

APP_ROOT=os.path.abspath(os.path.dirname(__file__))

def index(request):
	return render(request, 'canvas/home.html', {"title":"home"})

def display(request, canvas_name=None, adjustable=None):
	return render(request, 'canvas/display.html', {"title":"display", "canvas":canvas_name, "adjustable":adjustable})
		
def search(request, query=None):
	return render(request, 'canvas/search.html', {"title":"search","query":query})

def min(request, type=None, file=None):
	typeScript=open(APP_ROOT+'/js/'+type+".js")
	fileScript=open(APP_ROOT+'/js/'+type+"/"+file)
	typeOutput=typeScript.read()
	fileOutput=fileScript.read()
	minified=minify(typeOutput+";"+fileOutput,mangle=True)
	return HttpResponse(minified,content_type='script/javascript')

def js(request, type=None,file=None):
	typeScript=open(APP_ROOT+'/js/'+type+".js")
	fileScript=open(APP_ROOT+'/js/'+type+"/"+file)
	typeOutput=typeScript.read()
	fileOutput=fileScript.read()
	return HttpResponse(typeOutput+";"+fileOutput,content_type='script/javascript')
