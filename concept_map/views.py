from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse, Http404, JsonResponse

from .models import Node

import json

# Create your views here.


def index(request):
    return render(request, 'concept_map/index.html', {})

# node/


def get_nodes(request):
    nodes = get_list_or_404(Node)

    context = {}

    for node in nodes:
        context[node.id] = node.text

    return JsonResponse(context)
