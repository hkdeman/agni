from django.urls import path, include
from . import views

urlpatterns = [
    path('check-ssh-connection', views.check_ssh_connection),
]