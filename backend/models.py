from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser, User


class DataLoggingModel(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    created_on = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    Humidity = models.FloatField(blank=True)
    Air_Temp = models.FloatField(blank=True)
    Soil_Moisture = models.FloatField(blank=True)
    Soil_Temp = models.FloatField(blank=True)
    Pressure = models.FloatField(blank=True)
