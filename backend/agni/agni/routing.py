from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import terminal.routing
import editor.routing
import overview.routing
import network.routing
import process.routing

routes = []
# routes.extend(terminal.routing.websocket_urlpatterns)
# routes.extend(editor.routing.websocket_urlpatterns)
routes.extend(overview.routing.websocket_urlpatterns)
# routes.extend(network.routing.websocket_urlpatterns)
# routes.extend(process.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            routes
        )
    ),
})