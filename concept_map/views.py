from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse, Http404, JsonResponse

from .models import Node, Relationship

import json

# Create your views here.


def index(request):
    """'/' route."""
    return render(request, 'concept_map/index.html', {})


def get_nodes(request):
    """'/node' route."""
    nodes = get_list_or_404(Node)
    relationships = get_list_or_404(Relationship)

    context = {
        "nodeDataArray": [],
        "linkDataArray": []
    }

    # { key: 13, text: "melting glaciers" }
    # { from: 1, to: 2 }

    for node in nodes:
        context['nodeDataArray'].append({"key": node.id, "text": node.text})

    for relationship in relationships:
        # print(str(relationship.from_node) + str(relationship.to_node))
        context['linkDataArray'].append(
            {
                "from": relationship.from_node.id,
                "to": relationship.to_node.id
            }
        )

    return JsonResponse(context)


def add_node(request):
    """'node/add/' route."""

    node_text = request.POST['node_text']

    

    return HttpResponse(f"TODO: add a new node {node_text}")


def delete_node(request):
    """'node/delete/' route."""
    return HttpResponse("TODO: delete a node")


def add_relationship(request):
    """'node/relate/' route."""
    return HttpResponse("TODO: add a relationship between two nodes")
