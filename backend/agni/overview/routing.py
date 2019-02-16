from django.conf.urls import url

from .consumers import network_overview
from .consumers import ssh_network_overview

websocket_urlpatterns = [
    url(r'^api/host/overview$', network_overview.NetworkOverviewConsumer),
    url(r'^api/ssh/overview$', ssh_network_overview.SSHNetworkOverviewConsumer),
]