from django.conf.urls import url

from .consumers import remote_access
from .consumers import ssh_remote_access

websocket_urlpatterns = [
    url(r'^api/host/remote-access$', remote_access.RemoteAccessConsumer),
    url(r'^api/ssh/remote-access$', ssh_remote_access.SSHRemoteAccessConsumer),
]