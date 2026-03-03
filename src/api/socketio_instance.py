from flask_socketio import SocketIO

socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode="gevent",
    ping_interval=25,
    ping_timeout=60
)
