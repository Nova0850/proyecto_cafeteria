from django.contrib import admin
from .models import Producto, Etiqueta, Configuracion, Galeria,Contacto,QuienesSomos, Diferencial,PreguntaFrecuente

# Register your models here.
#menu

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    filter_vertical = ('etiquetas',)
admin.site.register(Etiqueta)
admin.site.register(Configuracion)
admin.site.register(Galeria)
admin.site.register(Contacto)
admin.site.register(QuienesSomos)
admin.site.register(Diferencial)
admin.site.register(PreguntaFrecuente)