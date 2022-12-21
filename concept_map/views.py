from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse, Http404, JsonResponse

from .models import Node

import json

# Create your views here.


def index(request):
    """'/' route."""
    return render(request, 'concept_map/index.html', {})


def get_nodes(request):
    """'/node' route."""
    nodes = get_list_or_404(Node)

    context = {
        "nodeDataArray": [],
        "linkDataArray": []
    }

    # { key: 13, text: "melting glaciers" }
    # { from: 1, to: 2 }

    for node in nodes:
        context['nodeDataArray'].append({"key": node.id, "text": node.text})

        print(node.connections.all())

        for connection in node.connections.all():
            context['linkDataArray'].append(
                {
                    "from": node.id,
                    "to": connection.id
                }
            )

    return JsonResponse(context)
