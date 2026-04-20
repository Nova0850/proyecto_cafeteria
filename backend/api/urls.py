# urls.py
from django.urls import path
from .views import lista_productos
#menu
urlpatterns = [
    path('productos/', lista_productos),  
]