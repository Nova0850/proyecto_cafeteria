from django.db import models

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

