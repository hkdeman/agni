from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import terminal.routing
import editor.routing
import overview.routing

routes = []
# routes.extend(terminal.routing.websocket_urlpatterns)
# routes.extend(editor.routing.websocket_urlpatterns)
routes.extend(overview.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            routes
        )
    ),
})