from rest_framework import serializers
from .models import *


class EmployeesSerializer(serializers.Serializer):
    class Meta:
        model = Employees
        field = "__all__"
