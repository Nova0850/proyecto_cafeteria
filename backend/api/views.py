from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Producto, Configuracion, Galeria
from .serializers import ProductoSerializer, ConfiguracionSerializer, GaleriaSerializer
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response

# 🔹 PRODUCTOS
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


# 🔹 DESTACADOS
@api_view(['GET'])
def productos_destacados(request):
    productos = Producto.objects.filter(destacado=True)
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)


# 🔹 CONFIGURACIÓN
@api_view(['GET'])
def obtener_configuracion(request):
    config = Configuracion.objects.first()
    serializer = ConfiguracionSerializer(config)
    return Response(serializer.data)


# 🔥 GALERÍA (IMPORTANTE)
@api_view(['GET', 'POST'])
def lista_galeria(request):

    if request.method == 'GET':
        galeria = Galeria.objects.all()
        serializer = GaleriaSerializer(galeria, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        if not request.user.is_authenticated:
            return Response({"error": "Debes iniciar sesión"}, status=403)

        data = request.data.copy()
        data['usuario'] = request.user.id  # 🔥 usuario automático

        serializer = GaleriaSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)
    
@api_view(['POST'])
def login_usuario(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({"mensaje": "Login correcto"})
    else:
        return Response({"error": "Credenciales inválidas"}, status=400)