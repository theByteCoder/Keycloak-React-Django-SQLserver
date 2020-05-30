from django.http import JsonResponse
from rest_framework import viewsets

from .serializer import *

from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required

from django.conf import settings
from django.contrib import auth
from django.http import request
from django.http import HttpResponseRedirect

from django.shortcuts import redirect


def index(request):
    response = redirect('secure')
    return response


# def index(request):
#     return HttpResponse('HTTP protocol is unauthorized. Try HTTPS <a href="/secure">Secure</a>')


@login_required
def secure(request):
    return HttpResponse('Secure page. <a href="/openid/logout">Logout</a>')


# Create your views here.
def create_record(request, **info):
    import json
    details = json.loads(info['info'])
    print(details)
    all_emp = Employees(emp_no=details['emp_no'], birth_date=details['birth_date'],
                        first_name=details['first_name'],
                        last_name=details['last_name']
                        , gender=details['gender'], hire_date=details['hire_date'])
    all_emp.save()
    return JsonResponse({'response': '201 Created'})


def get_record(request):
    record = []
    if request.method == "POST":
        emp_no = request.POST.get("emp_no", None)
        if emp_no == "*":
            # record = list(Employees.objects.all()[:100])
            record = list(Employees.objects.all()[:1000])
        else:
            record = list(Employees.objects.all().values().filter(emp_no=emp_no))
    return JsonResponse(record, safe=False)


def get_logout_url(request):
    '''
    Return the url of the logout for keycloak
    '''
    keycloak_redirect_url = settings.OIDC_OP_LOGOUT_ENDPOINT or None
    return keycloak_redirect_url + "?redirect_uri=" + request.build_absolute_uri("/")


def keycloak_logout(request):
    '''
    Perform the logout of the app and redirect to keycloak
    '''
    django_logout_url = settings.LOGOUT_REDIRECT_URL or '/'

    if request.user.is_authenticated():
        logout_url = get_logout_url(request)

        # Log out the Django user if they were logged in.
        auth.logout(request)

        return HttpResponseRedirect(logout_url)


# @staff_member_required
def get_record_all(request):
    all_emp_list = {}
    if request.user.is_authenticated():
        all_emp = Employees.objects.all().values()[:100]
        all_emp_list = list(all_emp)
    else:
        all_emp_list = {'response': '401 Unauthorized'}
    return JsonResponse(all_emp_list, safe=False)


def get_record_single(request, emp_no):
    all_emp = list(Employees.objects.all().values().filter(emp_no=emp_no))
    if not (len(all_emp) == 0):
        return JsonResponse(all_emp, safe=False)
    else:
        return JsonResponse([], safe=False)


def update_record(request, **info):
    import json
    details = json.loads(info['info'])
    print(details)
    all_emp = Employees(emp_no=details['emp_no'], birth_date=details['birth_date'], first_name=details['first_name'],
                        last_name=details['last_name']
                        , gender=details['gender'], hire_date=details['hire_date'])
    all_emp.save()
    return JsonResponse({'response': '201 Updated'})


def delete_record(request, emp_no):
    if emp_no != "" and type(emp_no) is not None:
        instance = Employees.objects.filter(emp_no=emp_no)
        print(instance)
        if instance.exists():
            instance.delete()
            return JsonResponse({'response': '204 Deleted'})
        else:
            return JsonResponse({'response': '404 Not Found'})


def get_last_employee_number():
    all_emp = Employees.objects.all().values()
    all_emp_list = list(all_emp)
    last_emp_record = all_emp_list[len(all_emp_list) - 1]
    return last_emp_record["emp_no"]


def google_search(request):
    return JsonResponse({'google': 'googlesearch.html'})


class EmployeesViews(viewsets.ModelViewSet):
    serializer_class = EmployeesSerializer
    queryset = Employees.objects.all()
