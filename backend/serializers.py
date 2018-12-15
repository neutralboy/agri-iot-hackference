from rest_framework import serializers
from .models import DataLoggingModel
from django.contrib.auth.models import AbstractUser, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username",)


class DataLogSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = DataLoggingModel
        fields = ("id",
                  "created_on",
                  "user",
                  "Air_Temp",
                  "Humidity",
                  "Soil_Temp",
                  "Soil_Moisture",
                  "Pressure"
                  )
