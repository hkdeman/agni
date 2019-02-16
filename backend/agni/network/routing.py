from django.conf.urls import url

from .consumers import network
from .consumers import ssh_network

websocket_urlpatterns = [
    url(r'^api/host/network$', network.NetworkConsumer),
    url(r'^api/ssh/network$', ssh_network.SSHNetworkConsumer),
]