from django.db import models

class Canvas(models.Model):
	def __str__(self):
			return self.canvas_namee
	canvas_name=models.CharField(max_length=200)
	date_created=models.DateTimeField('date published')
	script_path=models.CharField(max_length=200)
