from django.db import models

# Create your models here.

#MENU PRODUCTOS
from django.db import models

class Producto(models.Model):
    CATEGORIAS = [
        ('bebida', 'Bebida'),
        ('comida', 'Comida'),
        ('te', 'Té'),
    ]

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)

    def __str__(self):
        return self.nombre