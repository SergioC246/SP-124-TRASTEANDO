"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, AdminUser, Client, Company
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

# conseguir un admin_user
@api.route('/admin_user/<int:admin_user_id>', methods=['GET'])
def get_one_admin_user(admin_user_id):
    admin_user = db.session.get(AdminUser, admin_user_id)

    if not admin_user:
        return jsonify({"message": "admin_user not found"}), 404

    return jsonify(admin_user.serialize()), 200


# crear un admin_user

@api.route('/admin_user', methods=['POST', 'GET'])
def create_or_get_admin_user():
    if request.method == "POST":
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not all([name, email, password]):
            return jsonify({"message": "Missing data"}), 400

        new_admin_user = AdminUser(name=name, email=email, password=password)
        db.session.add(new_admin_user)
        db.session.commit()

        return jsonify(new_admin_user.serialize()), 201

    else:
        result = db.session.execute(select(AdminUser)).scalars().all()
        return jsonify([admin_user.serialize() for admin_user in result]), 200


# editar un admin_user

@api.route('/admin_user/<int:admin_user_id>', methods=["PUT"])
def update_admin_user(admin_user_id):
    data = request.get_json()

    admin_user = db.session.get(AdminUser, admin_user_id)
    if not admin_user:
        return jsonify({"message": "admin_user not found"}), 404

    admin_user.name = data.get("name", admin_user.name)
    admin_user.email = data.get("email", admin_user.email)
    admin_user.password = data.get("password", admin_user.password)

    db.session.commit()

    return jsonify(admin_user.serialize()), 200


# delete un admin_user

@api.route('/admin_user/<int:admin_user_id>', methods=["DELETE"])
def delete_admin_user(admin_user_id):
    admin_user = db.session.get(AdminUser, admin_user_id)

    if not admin_user:
        return jsonify({"message": "admin_user not found"}), 404

    db.session.delete(admin_user)
    db.session.commit()

    return jsonify({"message": "admin_user deleted"}), 200


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

    if not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Email and password are required"}), 400

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

# conseguir una compañia


@api.route('/companies/<int:company_id>', methods=["GET"])
def get_one_company(company_id):
    company = db.session.get(Company, company_id)

    if not company:
        return jsonify({"message": "Company not found"}), 404
    return jsonify(company.serialize()), 200

# crear una comàñia


@api.route('/companies', methods=["POST", "GET"])
def companies():
    if request.method == "POST":
        data = request.get_json()

        name = data.get("name")
        cif = data.get("cif")
        address = data.get("address")
        email = data.get("email")
        password = data.get("password")

        if not all([name, cif, address, email, password]):
            return jsonify({"message": "Missing data"}), 400

        new_company = Company(name=name, cif=cif,
                              address=address, email=email, password=password)
        db.session.add(new_company)
        db.session.commit()

        return jsonify(new_company.serialize()), 201

    else:
        result = db.session.execute(select(Company)).scalars().all()
        return jsonify([company.serialize() for company in result]), 200

# editar una compañia


@api.route('/companies/<int:company_id>', methods=["PUT"])
def update_company(company_id):
    data = request.get_json()

    company = db.session.get(Company, company_id)
    if not company:
        return jsonify({"message": "Company not found"}), 404

    company.name = data.get("name", company.name)
    company.cif = data.get("cif", company.cif)
    company.address = data.get("address", company.address)
    company.email = data.get("email", company.email)

    db.session.commit()

    return jsonify(company.serialize()), 200

# delete company


@api.route('/companies/<int:company_id>', methods=["DELETE"])
def delete_company(company_id):
    company = db.session.get(Company, company_id)

    if not company:
        return jsonify({"message": "Company not found"}), 404

    db.session.delete(company)
    db.session.commit()

    return jsonify({"message": "Company deleted"}), 200




# conseguir todos location
@api.route('')





# conseguir un location




# crear un location



# editar un location




# eliminar un location
