from django.conf.urls import url

from .consumers import network_details
from .consumers import ssh_network_details

websocket_urlpatterns = [
    url(r'^api/host/network$', network_details.NetworkDetailsConsumer),
    url(r'^api/ssh/network$', ssh_network_details.SSHNetworkDetailsConsumer),
]