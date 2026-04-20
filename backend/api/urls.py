# urls.py
from django.urls import path
from .views import lista_productos, productos_destacados, obtener_configuracion
#menu y productos destacados
urlpatterns = [
    path('productos/', lista_productos),
    path('destacados/', productos_destacados),
    path('configuracion/', obtener_configuracion),
]