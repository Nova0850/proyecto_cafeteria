# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Producto
from .serializers import ProductoSerializer
from .models import Configuracion
from .serializers import ConfiguracionSerializer

@api_view(['GET'])
def lista_productos(request):
    categoria = request.GET.get('categoria')
    buscar = request.GET.get('buscar')

    productos = Producto.objects.all()

    if categoria and categoria.lower() != "todos":
        productos = productos.filter(categoria__iexact=categoria)

    if buscar:
        productos = productos.filter(nombre__icontains=buscar)

    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

#SOLO PARA PRODUCTOS DESTACADOS
@api_view(['GET'])
def productos_destacados(request):
    productos = Producto.objects.filter(destacado=True)
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def obtener_configuracion(request):
    config = Configuracion.objects.first()
    serializer = ConfiguracionSerializer(config)
    return Response(serializer.data)