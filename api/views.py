from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import (
    ProductoSerializer,
    ConfiguracionSerializer,
    GaleriaSerializer,
    ContactoSerializer,
    QuienesSomosSerializer,
    DiferencialSerializer,
    PreguntaFrecuenteSerializer

)
from .models import (
    Producto,
    Configuracion,
    Galeria,
    Contacto,
    QuienesSomos,
    Diferencial,
    PreguntaFrecuente
)

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


# ---------------- PRODUCTOS ----------------

@api_view(['GET'])
def lista_productos(request):

    categoria = request.GET.get('categoria')
    buscar = request.GET.get('buscar')

    productos = Producto.objects.all()

    if categoria and categoria.lower() != "todos":
        productos = productos.filter(
            categoria__iexact=categoria
        )

    if buscar:
        productos = productos.filter(
            nombre__icontains=buscar
        )

    serializer = ProductoSerializer(
        productos,
        many=True
    )

    return Response(serializer.data)



# ---------------- DESTACADOS ----------------

@api_view(['GET'])
def productos_destacados(request):

    productos = Producto.objects.filter(
        destacado=True
    )

    serializer = ProductoSerializer(
        productos,
        many=True
    )

    return Response(serializer.data)



# ---------------- CONFIG ----------------

@api_view(['GET'])
def obtener_configuracion(request):

    config = Configuracion.objects.first()

    serializer = ConfiguracionSerializer(
        config
    )

    return Response(serializer.data)



# ---------------- GALERIA ----------------

@api_view(['GET','POST'])
def lista_galeria(request):

    # VER HISTORIAS
    if request.method == "GET":

        galeria = Galeria.objects.all().order_by("-id")

        serializer = GaleriaSerializer(
            galeria,
            many=True
        )

        return Response(
            serializer.data
        )


    # PUBLICAR HISTORIA
    if request.method == "POST":

        from django.contrib.auth.models import User

        username = request.data.get("usuario")

        user = User.objects.get(
            username=username
        )

        data = request.data.copy()

        serializer = GaleriaSerializer(
            data=data
        )

        if serializer.is_valid():

            serializer.save(
                usuario=user
            )

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=400
        )


# ---------------- REGISTRO ----------------

# REGISTRO
@api_view(['POST'])
def registro_usuario(request):

    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error":"faltan datos"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error":"usuario ya existe"},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({
        "usuario": user.username
    })


# LOGIN
@api_view(['POST'])
def login_usuario(request):

    username=request.data.get("username")
    password=request.data.get("password")

    user=authenticate(
        username=username,
        password=password
    )

    if user:
        login(request,user)

        return Response({
            "usuario":user.username
        })

    return Response(
        {"error":"credenciales invalidas"},
        status=400
    )



@api_view(["GET"])
def contacto_api(request):
    contacto = Contacto.objects.first()
    serializer = ContactoSerializer(contacto)
    return Response(serializer.data)

@api_view(['GET'])
def quienes_somos_api(request):

    quienes = QuienesSomos.objects.first()
    serializer = QuienesSomosSerializer(quienes)

    return Response(
        serializer.data
    )


@api_view(['GET'])
def diferencial_api(request):

    items = Diferencial.objects.all()

    serializer = DiferencialSerializer(
        items,
        many=True
    )

    return Response(
        serializer.data
    )
@api_view(['GET'])
def preguntas_frecuentes_api(request):

    buscar = request.GET.get("buscar")

    preguntas = PreguntaFrecuente.objects.all()

    if buscar:
        preguntas = preguntas.filter(
            pregunta__icontains=buscar
        )

    serializer = PreguntaFrecuenteSerializer(
        preguntas,
        many=True
    )

    return Response(serializer.data)