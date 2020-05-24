from django import forms
from .models import *


class EmployeesForm(forms.ModelForm):
    class Meta:
        model = Employees
        fields = "__all__"


class EmployeesFormToDelete(forms.ModelForm):
    class Meta:
        model = Employees
        fields = ["emp_no"]
