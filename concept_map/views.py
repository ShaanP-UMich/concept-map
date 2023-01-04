from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse, Http404, JsonResponse, HttpRequest
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Node, Relationship

import json

# Create your views here.


def index(request):
    """'/' [GET] route."""
    return render(request, 'concept_map/index.html', {})


def get_nodes(request):
    """'/node' [GET] route."""
    try:
        nodes = get_list_or_404(Node)
    except Http404:
        nodes = []

    try:
        relationships = get_list_or_404(Relationship)
    except Http404:
        relationships = []

    context = {
        "nodeDataArray": [],
        "linkDataArray": []
    }

    # { key: 13, text: "melting glaciers" }
    # { from: 1, to: 2 }

    i = 0
    for node in nodes:
        if i % 2 == 0:
            context['nodeDataArray'].append({
                "key": node.id,
                "text": node.text,
                "category": node.category
            })
        else:
            context['nodeDataArray'].append({
                "key": node.id,
                "text": node.text,
                "category": node.category
            })
        # i += 1

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
    """'node/add/' [POST] route."""
    # context = {}

    post_data = json.loads(request.body.decode('utf-8'))
    # print(post_data)

    node_text = post_data['node_text']

    new_node = Node(text=node_text)
    new_node.save()

    # context[new_node.id] = new_node.text

    # return HttpResponse(f"TODO: add a new node {node_text}")
    return get_nodes(request)
    # return HttpResponse(status=200)


def delete_node(request):
    """'node/delete/' [POST] route."""

    post_data = json.loads(request.body.decode('utf-8'))

    selected_node = post_data['node']
    print(selected_node)

    victim = Node.objects.get(pk=selected_node)
    victim.delete()

    return get_nodes(request)


def add_relationship(request):
    """'node/relate/' [POST] route."""

    post_data = json.loads(request.body.decode('utf-8'))
    print(json.dumps(post_data, indent=2))

    from_node = Node.objects.get(pk=post_data['from_node'])
    to_node = Node.objects.get(pk=post_data['to_node'])

    new_relationship = Relationship(from_node=from_node, to_node=to_node)
    new_relationship.save()
    print(new_relationship)

    return get_nodes(request)


def remove_relationship(request):
    """'node/unrelate/' [POST] route."""

    return HttpResponse("TODO: remove a relationship between two nodes")
