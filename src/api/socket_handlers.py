from flask import request
from flask_socketio import join_room, leave_room
from flask_jwt_extended import decode_token

from api.socketio_instance import socketio
from api.realtime_rooms import conversation_room

@socketio.on("connect")
def handle_connect(auth):
    try:
        token = auth.get("token") if auth else None
        if not token:
            return False

        decoded = decode_token(token)
        user_id = int(decoded["sub"])  # identity guardada en create_access_token
        request.environ["uid"] = user_id

    except Exception:
        return False


@socketio.on("room:join")
def handle_join(data):
    my_id = request.environ.get("uid")
    my_role = data.get("myRole")
    target_id = data.get("targetId")
    target_role = data.get("targetRole")

    room = conversation_room(my_id, my_role, target_id, target_role)
    join_room(room)


@socketio.on("room:leave")
def handle_leave(data):
    my_id = request.environ.get("uid")
    my_role = data.get("myRole")
    target_id = data.get("targetId")
    target_role = data.get("targetRole")

    room = conversation_room(my_id, my_role, target_id, target_role)
    leave_room(room)