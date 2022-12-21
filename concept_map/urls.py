from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('node/', views.get_nodes, name='node')
]