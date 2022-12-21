from django.urls import path

from . import views

app_name = 'concept_map'
urlpatterns = [
    path('', views.index, name='index'),
    path('node/', views.get_nodes, name='node'),
    path('node/add/', views.add_node, name="add_node"),
    path('node/delete/', views.delete_node, name="delete_node"),
    path('node/relate/', views.add_relationship, name="relate_nodes")
]
