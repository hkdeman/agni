from django.conf.urls import url

from .consumers import process_details
from .consumers import ssh_process_details

websocket_urlpatterns = [
    url(r'^api/host/process$', process_details.ProcessDetailsConsumer),
    url(r'^api/ssh/process$', ssh_process_details.SSHProcessDetailsConsumer),
]