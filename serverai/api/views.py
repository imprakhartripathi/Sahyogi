from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def hello_world(request):
    return JsonResponse({'message': 'Hello, world!'})
