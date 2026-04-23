from django.contrib import admin
from .models import Producto, Etiqueta, Configuracion, Galeria

# Register your models here.
#menu

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    filter_vertical = ('etiquetas',)
admin.site.register(Etiqueta)
admin.site.register(Configuracion)
admin.site.register(Galeria)
