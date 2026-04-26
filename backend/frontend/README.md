# Proyecto Cafetería — React + Django + Docker Compose

Este proyecto usa:

* **Frontend:** React
* **Backend:** Django
* **Contenedores:** Docker + Docker Compose

La idea es que React consuma la API de Django y ambos trabajen juntos.

---

# Estructura del proyecto

```text
proyecto_Cafeteria/
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── api/
│   └── backend/
│       ├── settings.py
│       ├── urls.py
│       └── ...
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── public/
│
└── docker-compose.yml
```

---

# Paso 1: Crear proyecto Django

Dentro de `backend/`:

```bash
pip install django djangorestframework django-cors-headers
django-admin startproject backend .
python manage.py startapp api
pip freeze > requirements.txt
```

---

# Paso 2: Dockerfile para Django

Archivo: `backend/Dockerfile`

```dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

---

# Paso 3: requirements.txt

Archivo: `backend/requirements.txt`

```txt
Django
djangorestframework
django-cors-headers
```

---

# Paso 4: Crear proyecto React

Desde la raíz del proyecto:

```bash
npx create-react-app frontend
```

---

# Paso 5: Dockerfile para React

Archivo: `frontend/Dockerfile`

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST=0.0.0.0

CMD ["npm", "start"]
```

---

# Paso 6: docker-compose.yml

Archivo: `docker-compose.yml`

```yaml
services:
  backend:
    build: ./backend
    container_name: django_backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    container_name: react_frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    stdin_open: true
    tty: true
    depends_on:
      - backend
    environment:
      - CHOKIDAR_USEPOLLING=true
```

---

# Paso 7: Configurar Django

Editar:

```text
backend/backend/settings.py
```

## INSTALLED_APPS

Agregar:

```python
'rest_framework',
'corsheaders',
'api',
```

## MIDDLEWARE

Agregar al inicio:

```python
'corsheaders.middleware.CorsMiddleware',
```

## Al final del archivo

```python
CORS_ALLOW_ALL_ORIGINS = True
```

---

# Paso 8: Crear API de prueba

## Archivo: `backend/api/views.py`

```python
from django.http import JsonResponse


def prueba(request):
    data = {
        "mensaje": "Conexion React + Django funcionando correctamente"
    }
    return JsonResponse(data)
```

## Archivo: `backend/api/urls.py`

```python
from django.urls import path
from .views import prueba

urlpatterns = [
    path('prueba/', prueba),
]
```

## Archivo: `backend/backend/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

---

# Paso 9: Migraciones Django

```bash
docker exec -it django_backend python manage.py migrate
```

---

# Paso 10: Ejecutar proyecto

Primera vez:

```bash
docker-compose up --build
```

Después:

```bash
docker-compose up
```

En segundo plano:

```bash
docker-compose up -d
```

Detener:

```bash
docker-compose down
```

---

# URLs importantes

## React

```text
http://localhost:3000
```

## Django API

```text
http://localhost:8000/api/prueba/
```

# ☕ Proyecto Cafetería

### React + Django + Docker Compose

Este proyecto es una aplicación web de una cafetería compuesta por:

* **Frontend:** React
* **Backend:** Django + Django REST Framework
* **Contenedores:** Docker + Docker Compose

El frontend consume una API REST desarrollada en Django.

---

# 📁 Estructura del proyecto

```id="xv6p4k"
proyecto_Cafeteria/
│
├── backend/              # Backend Django
│   ├── api/              # App principal (productos)
│   ├── backend/          # Configuración del proyecto
│   ├── Dockerfile
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/             # Frontend React
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

# 🚀 Cómo ejecutar el proyecto (IMPORTANTE)

## 🔧 Paso 1: Levantar contenedores

Desde la raíz del proyecto:

```bash id="cmd1"
docker-compose up --build
```

---

## 🔧 Paso 2: Ejecutar migraciones (OBLIGATORIO la primera vez)

En otra terminal:

```bash id="cmd2"
docker exec -it django_backend python manage.py migrate
```

---

## 🔧 Paso 3: Crear superusuario (opcional)

```bash id="cmd3"
docker exec -it django_backend python manage.py createsuperuser
```

---

## 🔧 Paso 4: Acceder al sistema

### Frontend (INTERFAZ PRINCIPAL)

```text id="url1"
http://localhost:3000
```

👉 Aquí se visualiza toda la aplicación

---

### Backend (API)

```text id="url2"
http://localhost:8000/api/productos/
```

---

### Panel Admin

```text id="url3"
http://localhost:8000/admin/
```

---

# 📡 API de Productos

## 🔹 GET /api/productos/

Devuelve todos los productos registrados.

---

## 🔹 Filtros disponibles

### Por categoría

```id="cmd4"
/api/productos/?categoria=bebida
/api/productos/?categoria=comida
/api/productos/?categoria=te
```

---

### Por búsqueda

```id="cmd5"
/api/productos/?buscar=cafe
```

---

## 🔹 Ejemplo de respuesta

```json id="json1"
[
  {
    "id": 1,
    "nombre": "Latte",
    "descripcion": "Café con leche",
    "precio": "18.00",
    "categoria": "bebida",
    "imagen": null
  }
]
```

---

# 🧠 Explicación del Backend

## 📂 Vista principal (`views.py`)

Archivo:

```id="file1"
backend/api/views.py
```

### Función: `lista_productos`

Esta vista:

* Obtiene todos los productos de la base de datos
* Filtra por categoría si se envía `categoria`
* Permite buscar por nombre con `buscar`
* Devuelve los datos en formato JSON

Ejemplo:

```id="cmd6"
/api/productos/?categoria=bebida&buscar=cafe
```

---

## 📂 Serializador (`serializers.py`)

Convierte los datos del modelo a JSON para que React los pueda consumir.

---

## 📂 Modelo (`models.py`)

Define la estructura de los productos:

* nombre
* descripcion
* precio
* categoria
* imagen

---

## 📂 URLs (`urls.py`)

Conecta las rutas de la API:

```id="cmd7"
/api/productos/
```

---

# 🔗 Conexión con el frontend

React consume los datos desde:

```id="cmd8"
http://localhost:8000/api/productos/
```

Ejemplo:

```javascript id="js1"
fetch("http://localhost:8000/api/productos/")
```

---

# 🛠️ Panel de administración

```text id="url4"
http://localhost:8000/admin/
```

Permite:

* Crear productos
* Editar productos
* Eliminar productos

---

# 🐳 Comandos útiles

```bash id="cmd9"
docker ps
docker-compose down
docker-compose up
```

---

# ⚠️ Problemas comunes

## 🔴 No carga frontend

→ Verificar puerto 3000

---

## 🔴 No conecta con backend

→ Verificar puerto 8000

---

## 🔴 No aparecen productos

→ Crear productos en el admin

---

## 🔴 Error CORS

→ Revisar settings.py:

```python id="cmd10"
CORS_ALLOW_ALL_ORIGINS = True
```

---

# 🔧 Tecnologías

* Django
* Django REST Framework
* React
* Docker

---

# 👨‍💻 Autores

* Backend: Celina
* Frontend: Jhamil
