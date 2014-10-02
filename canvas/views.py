from django.shortcuts import render
from canvas.models import Canvas

def index(request):
	return render(request, 'canvas/home.html', {"title":"home"})

def display(request, canvas_name=None, adjustable=None):
	return render(request, 'canvas/display.html', {"title":"display", "canvas":canvas_name, "adjustable":adjustable})
		
def search(request, query=None):
	return render(request, 'canvas/search.html', {"title":"search","query":query})

