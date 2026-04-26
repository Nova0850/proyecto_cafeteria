from django.urls import path
from .views import *

urlpatterns = [
 path('registro/', registro_usuario),
 path('login/', login_usuario),
 path('galeria/', lista_galeria),
 path('productos/', lista_productos),
 path('destacados/', productos_destacados),
 path('configuracion/', obtener_configuracion),
path("contacto/", contacto_api),
path('quienes-somos/', quienes_somos_api),
path('diferencial/', diferencial_api),
path(
    'preguntas/',
    preguntas_frecuentes_api
),
]
