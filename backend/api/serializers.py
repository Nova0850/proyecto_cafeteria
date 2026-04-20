# serializers.py
from rest_framework import serializers
from .models import Producto

#menu

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'