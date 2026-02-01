"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# All clients

@api.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify([c.serialize() for c in clients]), 200

# A client

@api.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"msg": "Client not found"}), 404
    return jsonify(client.serialize()), 200

# Create client

@api.route('/clients', methods=['POST'])
def create_client():
    body = request.get_json()

    if not body or not body.get("email") or not body.get ("password"):
        return jsonify ({"msg": "Email and password are required"}), 400

    new_client = Client(
        email=body["email"],
        password=body["password"],
        is_active=True
    )    

    db.session.add(new_client)
    db.session.commit()

    return jsonify(new_client.serialize()), 200

# Edit client

@api.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"msg": "Client not found"}), 404
    
    body = request.get_json()

    client.email = body.get("email", client.email)
    client.is_active = body.get("is_active", client.is_active)

   
    db.session.commit()

    return jsonify(client.serialize()), 200

# Delete client

@api.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"msg": "Client not found"}), 404
    
    
    db.session.delete(client)
    db.session.commit()

    return jsonify({"msg": "Client deleted"}), 200
