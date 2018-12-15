from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.core.exceptions import ObjectDoesNotExist
from cryptography.fernet import Fernet
from django.contrib.auth.models import AbstractUser, User


from .models import DataLoggingModel
from .serializers import DataLogSerializer
'''
hri hash
'gAAAAABcFQknsMtB4-Va977B86e_ArHeU7_Hedr7bERXzDCGNgc0i9z9furhXy5qaH8va-rVS_wua4OCW5yEU7jDI-hT5lCZ7w=='
'''


def ReturnFieldDict(fields, req):
    ret_dict = {}
    for each in fields:
        ret_dict[each] = req.data[each]
    return ret_dict


key = b'02uT8xb6d5o5vl_AmiQRGiGlOGeAuTEaqKAq80pYqew='


def encrypt(user_id):
    cipher_suite = Fernet(key)
    cipher_text = cipher_suite.encrypt(bytes(user_id, 'utf-8'))
    return cipher_text


def decrypt(hash):
    cipher_suite = Fernet(key)
    return cipher_suite.decrypt(bytes(hash, 'utf-8'))


class PostDataAPI(APIView):

    def post(self, request):
        fields = [
            "Air_Temp",
            "Humidity",
            "Soil_Temp",
            "Soil_Moisture",
            "Pressure"
        ]
        a = ReturnFieldDict(fields, request)
        user_id = decrypt(request.data['hash'])
        user = User.objects.get(id=user_id)
        a['user'] = user
        b = DataLoggingModel(**a)
        b.save()
        return Response(status=status.HTTP_201_CREATED)


class ESPDataAPI(generics.ListAPIView):
    model = DataLoggingModel
    serializer_class = DataLogSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = User.objects.get(username=username)
        queryset = DataLoggingModel.objects.filter(
            user=user).order_by("-created_on")
        return queryset


class GetDownloadData(APIView):
    def get(self, request, **kwargs):
        username = self.kwargs['username']
        user = User.objects.get(username=username)
        queryset = DataLoggingModel.objects.filter(
            user=user).order_by("-created_on")[:100]
        serializer = DataLogSerializer(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
