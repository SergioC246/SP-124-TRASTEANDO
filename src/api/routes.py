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












@api.route('/admin/<int:admin_id>', methods=['GET'])
def get_one_admin(admin_id):
    admin = db.session.get(admin, admin_id).scalar_one()

    if not admin:
        return jsonify({"message": "admin not found"}), 404
    return jsonify(admin.serialize()), 200


# crear un admin

@api.route('/admin', methods=['POST', 'GET'])
def admin():
    if request.method == "POST":
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not all([name, email, password]):
            return jsonify({"message": "Missing data"}), 400
        
        new_admin = admin(name=name, email=email, password=password)
        db.session.add(new_admin)
        db.session.commit()

        return jsonify(new_admin.serialize()), 201

    else:
        result = db.session.execute(select(admin)).scalars().all()
        return jsonify([admin.serialize() for admin in result]), 200
    


# editar un admin

@api.route('/admin/<int:admin_id', methods=["PUT"])
def update_admin(admin_id):
    data = request.get_json()

    admin = db.session.get(admin, admin_id)
    if not admin:
        return jsonify({"message": "admin not found"}), 404

    admin.name = data.get("name", admin.name)
    admin.email = data.get("email", admin.email)
    admin.password = data.get("password", admin.password)

    db.session.commit()

    return jsonify(admin.serialize()), 200


# delete un admin

@api.route('/admin/<int:admin_id>', methods=["DELETE"])
def delete_admin(admin_id):
    admin = db.session.get(admin, admin_id)

    if not admin:
        return jsonify({"message": "admin not found"}), 404
    
    db.session.delete(admin)
    db.session.commit()

    return jsonify({"message": "admin deleted"}), 200




# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
           
                                    


