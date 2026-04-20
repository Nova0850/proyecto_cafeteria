from django.contrib import admin
from .models import Producto, Etiqueta ,Configuracion
# Register your models here.
#menu

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    filter_vertical = ('etiquetas',)
admin.site.register(Etiqueta)
admin.site.register(Configuracion)