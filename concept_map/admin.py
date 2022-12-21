from django.contrib import admin

from .models import Node, Relationship

# Register your models here.

admin.site.register(Node)
admin.site.register(Relationship)