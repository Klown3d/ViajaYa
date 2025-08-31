from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
import random

from .models import *
from .serializers import *

# ----------------------
# AUTH
# ----------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.activo = False
        user.save()
        send_verification_code(user)
        return Response({"message": "Registro exitoso. Verifica tu correo."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def send_verification_code(user):
    code = random.randint(100000, 999999)
    user.codigo_activacion = code
    user.save()
    send_mail(
        "Volaya - Código de verificación",
        f"Tu código de verificación es: {code}",
        "noreply@volaya.com",
        [user.correo],
        fail_silently=False,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo = request.data.get("correo")
    password = request.data.get("password")

    if not correo or not password:
        return Response({"error": "Correo y contraseña son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, correo=correo, password=password)
    if not user:
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.activo:
        return Response({"error": "Usuario no activo, valida tu correo"}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def log_code(request):
    usuario_id = request.data.get("id_usuario")
    codigo = request.data.get("codigo")

    try:
        user = Usuarios.objects.get(id=usuario_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if user.activo:
        return Response({"error": "El usuario ya está activado"}, status=status.HTTP_400_BAD_REQUEST)

    if str(user.codigo_activacion) != str(codigo):
        return Response({"error": "Código incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

    user.activo = True
    user.codigo_activacion = None
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "Usuario activado correctamente",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    }, status=status.HTTP_200_OK)


# ----------------------
# CRUD: CIUDADES Y BUSES
# ----------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_ciudad(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos"}, status=status.HTTP_403_FORBIDDEN)
    serializer = CiudadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Ciudad creada correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_bus(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos"}, status=status.HTTP_403_FORBIDDEN)
    serializer = BusSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Bus creado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------
# VIAJES Y RESERVAS
# ----------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_viaje(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos"}, status=status.HTTP_403_FORBIDDEN)
    serializer = ViajeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Viaje creado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reservar_viaje(request):
    data = request.data.copy()
    data["usuario"] = request.user.id
    serializer = ReservaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Reserva creada correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------
# GET ENDPOINTS
# ----------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def get_ciudades(request):
    ciudades = Ciudades.objects.all()
    return Response(CiudadSerializer(ciudades, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_buses(request):
    buses = Buses.objects.all()
    return Response(BusSerializer(buses, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_viajes(request):
    viajes = Viajes.objects.all()
    return Response(ViajeSerializer(viajes, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reservas_usuario(request):
    reservas = Reservas.objects.filter(usuario=request.user)
    return Response(ReservaSerializer(reservas, many=True).data)
