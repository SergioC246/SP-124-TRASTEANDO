"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200












@api.route('/administradors/<int:administrador:id>', methods=['GET'])
def get__one_administrador(administrador_id):
    Administrador = db.session.get(Administrador, administrador_id).scalar_one()

    if not Administrador:
        return jsonify({"message": "Administrador not found"}), 404
    return jsonify(Administrador.serialize()), 200


# crear un administrador

@api.route('/administradors', methods=['POST', 'GET'])
def administradors():
    if request.method == "POST":
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not all([name, email, password]):
            return jsonify({"message": "Missing data"}), 400
        
        new_administrador = Administrador(name=name, email=email, password=password)
        db.session.add(new_administrador)
        db.session.commit()

        return jsonify(new_administrador.serialize()), 201

    else:
        result = db.session.execute(select(Administrador)).scalars().all()
        return jsonify([administrador.serialize() for administrador in result]), 200
    


# editar un administrador

@api.route('/administradors/<int:administrador_id', methods=["PUT"])
def update_administrador(administrador_id):
    data = request.get_json()

    administrador = db.session.get(administrador, administrador_id)
    if not administrador:
        return jsonify({"message": "Administrador not found"}), 404

    administrador.name = data.get("name", administrador.name)
    administrador.email = data.get("email", administrador.email)
    administrador.password = data.get("password", administrador.password)

    db.session.commit()

    return jsonify(administrador.serialize()), 200


# delete un administrador

@api.route('/administradors/<int:administrador_id>', methods=["DELETE"])
def delete_administrador(administrador_id):
    administrador = db.session.get(administrador, administrador_id)

    if not administrador:
        return jsonify({"message": "Administrador not found"}), 404
    
    db.session.delete(administrador)
    db.session.commit()

    return jsonify({"message": "Administrador deleted"}), 200




# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
           
                                    


