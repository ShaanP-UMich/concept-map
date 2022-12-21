from django.urls import path

from . import views

app_name = 'concept_map'
urlpatterns = [
    path('', views.index, name='index'),
    path('node/', views.get_nodes, name='node')
]
