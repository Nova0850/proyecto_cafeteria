# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Producto
from .serializers import ProductoSerializer

@api_view(['GET'])
def lista_productos(request):
    categoria = request.GET.get('categoria')
    buscar = request.GET.get('buscar')

    productos = Producto.objects.all()

    if categoria and categoria != "todos":
        productos = productos.filter(categoria=categoria)

    if buscar:
        productos = productos.filter(nombre__icontains=buscar)

    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)