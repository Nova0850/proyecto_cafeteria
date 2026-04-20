# serializers.py
from rest_framework import serializers
from .models import Producto, Etiqueta ,Configuracion
#menu
        
class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    etiquetas = EtiquetaSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'
class ConfiguracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracion
        fields = '__all__'