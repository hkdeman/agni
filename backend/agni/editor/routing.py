from django.conf.urls import url

from .consumers import ssh_file_editor
from .consumers import file_editor

websocket_urlpatterns = [
    url(r'^api/host/file-editor$', file_editor.FileEditorConsumer),
    url(r'^api/ssh/file-editor$', ssh_file_editor.SSHFileEditorConsumer),
]