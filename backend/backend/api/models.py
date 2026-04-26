from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Etiqueta(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    
#MENU PRODUCTOS
class Producto(models.Model):
    CATEGORIAS = [
        ('bebida', 'Bebida'),
        ('comida', 'Comida'),
        ('te', 'Té'),
    ]

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    
    categoria = models.CharField(
        max_length=50,
        choices=CATEGORIAS  
    )

    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    destacado = models.BooleanField(default=False)
    etiquetas = models.ManyToManyField(Etiqueta, blank=True) 
    def __str__(self):
        return self.nombre
    
class Configuracion(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()

    horario_lunes_viernes = models.CharField(max_length=100)
    horario_sabado = models.CharField(max_length=100)
    horario_domingo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre




class Galeria(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='galeria/')
    categoria = models.CharField(max_length=50, default="general")
class Contacto(models.Model):
    telefono = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20)

    instagram = models.URLField()
    facebook = models.URLField()
    tiktok = models.URLField()

    mensaje_reserva = models.CharField(
        max_length=200,
        default="Hola, quiero hacer una reserva"
    )

    email = models.EmailField()

    def __str__(self):
        return "Contacto Cafetería"
    from django.db import models


class QuienesSomos(models.Model):
    titulo = models.CharField(
        max_length=150,
        default="Quiénes Somos"
    )

    descripcion_1 = models.TextField()

    descripcion_2 = models.TextField(
        blank=True,
        null=True
    )

    descripcion_3 = models.TextField(
        blank=True,
        null=True
    )

    frase_destacada = models.CharField(
        max_length=300,
        blank=True,
        null=True
    )

    imagen = models.ImageField(
        upload_to='inicio/quienes_somos/',
        blank=True,
        null=True
    )

class Diferencial(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.titulo