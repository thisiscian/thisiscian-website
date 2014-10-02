from django.shortcuts import render

def home(request):
	return render(request, 'plannr/home.html', {"title":"home"})

