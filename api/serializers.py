from rest_framework import serializers

from .models import (
    Producto,
    Etiqueta,
    Configuracion,
    Galeria,
    Contacto,
    QuienesSomos,
    Diferencial,
    PreguntaFrecuente
)


class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = "__all__"


class ProductoSerializer(serializers.ModelSerializer):
    etiquetas = EtiquetaSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Producto
        fields = "__all__"


class ConfiguracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracion
        fields = "__all__"


class GaleriaSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = Galeria
        fields = "__all__"


class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = "__all__"


class QuienesSomosSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuienesSomos
        fields = "__all__"


class DiferencialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diferencial
        fields = "__all__"


class PreguntaFrecuenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaFrecuente
        fields = "__all__"