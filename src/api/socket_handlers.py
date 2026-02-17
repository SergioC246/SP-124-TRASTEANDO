from flask import session
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
        session["uid"] = user_id

        print(f"✅ Socket conectado - User ID: {user_id}")

        return True

    except Exception as e:
        rint(f"❌ Error en connect: {e}")
        return False


@socketio.on("room:join")
def handle_join(data):
    my_id = session.get("uid")
    my_role = data.get("myRole")
    target_id = data.get("targetId")
    target_role = data.get("targetRole")

    room = conversation_room(my_id, my_role, target_id, target_role)
    join_room(room)

    print(f"✅ User {my_id} ({my_role}) joined room: {room}")


@socketio.on("room:leave")
def handle_leave(data):
    my_id = session.get("uid")
    my_role = data.get("myRole")
    target_id = data.get("targetId")
    target_role = data.get("targetRole")

    room = conversation_room(my_id, my_role, target_id, target_role)
    leave_room(room)

    print(f"✅ User {my_id} ({my_role}) left room: {room}")


def user_key(user_id: int, role: str) -> str:
    return f"{role}:{user_id}"


def conversation_room(my_id: int, my_role: str, target_id: int, target_role: str) -> str:
    a = user_key(my_id, my_role)
    b = user_key(target_id, target_role)
    left, right = sorted([a, b])
    return f"conv{left}__{right}"