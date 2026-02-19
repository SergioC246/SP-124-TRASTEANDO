"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import sqlalchemy as sa
from datetime import date, datetime
from sqlalchemy import select
import math
from sqlalchemy import select, and_, not_, cast, Date
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, AdminUser, Client, Company, Leases, Storage, Location
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
    email = body.get("email")
    password = body.get("password")

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
    client.photo_url = body.get("photo_url", client.photo_url)

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

# crear una compañia


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
    company.photo = data.get("photo", company.photo)

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


# conseguir location
@api.route('/location/<int:location_id>', methods=['GET'])
def get_one_location(location_id):
    location = db.session.get(Location, location_id)

    if not location:
        return jsonify({"message": "location not found"}), 404

    return jsonify(location.serialize()), 200


# crear un location
@api.route('/location', methods=['POST', 'GET'])
def create_or_get_location():
    if request.method == "POST":
        data = request.get_json()

        address = data.get("address")
        city = data.get("city")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        company_id = data.get("company_id")

        if not all([address, city, latitude, longitude, company_id]):
            return jsonify({"message": "Missing data"}), 400

        new_location = Location(
            address=address, city=city, latitude=latitude, longitude=longitude, company_id=company_id)
        db.session.add(new_location)
        db.session.commit()

        return jsonify(new_location.serialize()), 201

    else:
        result = db.session.execute(select(Location)).scalars().all()
        return jsonify([location.serialize() for location in result]), 200


# editar un location
@api.route('/location/<int:location_id>', methods=["PUT"])
def update_location(location_id):
    data = request.get_json()

    location = db.session.get(Location, location_id)
    if not location:
        return jsonify({"message": "location not found"}), 404

    location.address = data.get("address", location.address)
    location.city = data.get("city", location.city)
    location.latitude = data.get("latitude", location.latitude)
    location.longitude = data.get("longitude", location.longitude)

    company_id = data.get("company_id")
    if company_id is not None:
        try:
            location.company_id = int(company_id)
        except ValueError:
            return jsonify({"message": "Invalid company_id"}), 400

    db.session.commit()

    return jsonify(location.serialize()), 200


# eliminar un location
@api.route('/location/<int:location_id>', methods=["DELETE"])
def delete_location(location_id):
    location = db.session.get(Location, location_id)

    if not location:
        return jsonify({"message": "location not found"}), 404

    db.session.delete(location)
    db.session.commit()

    return jsonify({"message": "location deleted"}), 201
# get all leases


@api.route('/leases', methods=["GET"])
def get_leases():
    leases = db.session.execute(select(Leases)).scalars().all()
    return jsonify([lease.serialize()for lease in leases]), 200

# get one lease


@api.route('/leases/<int:lease_id>', methods=['GET'])
def get_one_lease(lease_id):
    lease = db.session.get(Leases, lease_id)

    if not lease:
        return jsonify({"message": "Lease not found"}), 404
    return jsonify(lease.serialize()), 200


# crear un lease

@api.route('/leases', methods=['POST'])
def create_lease():
    data = request.get_json()

    start_date = data.get("start_date")
    end_date = data.get("end_date")
    status = data.get("status", False)
    client_id = data.get("client_id")
    storage_id = data.get("storage_id")

    if None in [start_date, end_date, client_id, storage_id]:
        return jsonify({"message": "Missing required IDs or dates"}), 400

    new_lease = Leases(
        start_date=start_date,
        end_date=end_date,
        status=status,
        client_id=client_id,
        storage_id=storage_id
    )

    db.session.add(new_lease)
    db.session.commit()

    return jsonify(new_lease.serialize()), 201

# delete a lease


@api.route('/leases/<int:lease_id>', methods=['DELETE'])
def delete_lease(lease_id):
    lease = db.session.get(Leases, lease_id)

    if not lease:
        return jsonify({"message": "Lease not found"}), 404

    db.session.delete(lease)
    db.session.commit()

    return jsonify({"message": "Lease deleted"}), 200

# edit a lease


@api.route('/leases/<int:lease_id>', methods=['PUT'])
def update_lease(lease_id):
    data = request.get_json()

    lease = db.session.get(Leases, lease_id)
    if not lease:
        return jsonify({'message': "lease not found"}), 404

    lease.start_date = data.get("start_date", lease.start_date)
    lease.end_date = data.get("end_date", lease.end_date)
    lease.status = data.get("status", lease.status)
    lease.client_id = data.get("client_id", lease.client_id)
    lease.storage_id = data.get("storage_id", lease.storage_id)

    db.session.commit()

    return jsonify(lease.serialize()), 200
# All Storages


@api.route("/company/storage", methods=["GET"])
@jwt_required()
def get_company_storage():

    try:
        identity = get_jwt_identity()
        company_id = int(identity)

        # Obtener storages cuya location pertenezca a esta company
        storages = db.session.query(Storage).join(Location).filter(
            Location.company_id == company_id
        ).all()

        detailed_list = []
        for storage in storages:
            storage_data = storage.serialize()

            # Enriquecer con city
            location = db.session.get(Location, storage.location_id)
            if location:
                storage_data["city"] = location.city
            else:
                storage_data["city"] = "No asignada"

            detailed_list.append(storage_data)

        return jsonify(detailed_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Storage


@api.route("/storage/<int:storage_id>", methods=["GET"])
def get_storage(storage_id):
    storage = db.session.execute(select(Storage).where(
        Storage.id == storage_id)).scalar_one_or_none()

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404

    return jsonify(storage.serialize()), 200


# Update Storage

@api.route('/storage/<int:storage_id>', methods=["PUT"])
def update_storage(storage_id):
    storage = db.session.get(Storage, storage_id)

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404

    data = request.get_json()

    storage.size = data.get("size", storage.size)
    storage.price = data.get("price", storage.price)
    storage.location_id = data.get("location_id", storage.location_id)

    if "status" in data:
        val = data.get("status")
        if isinstance(val, bool):
            storage.status = val
        else:
            storage.status = True if str(val).lower() == "available" else False

    db.session.commit()

    return jsonify(storage.serialize()), 200

# Delete Storage


@api.route('/storage/<int:storage_id>', methods=["DELETE"])
def delete_storage(storage_id):
    storage = db.session.get(Storage, storage_id)

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404

    if storage.status == "occupied":
        return jsonify({"mesage": "Cannot delete occupied storage"}), 400

    db.session.delete(storage)
    db.session.commit()

    return jsonify({"message": "Storage deleted"}), 200


# api para hacer login de cliente
@api.route('/login/client', methods=['POST'])
def login_client():
    body = request.get_json()
    if body is None:
        return jsonify({"message": "Bad request"}), 400

    email = body.get("email")
    password = body.get("password")

    client = db.session.execute(select(Client).where(
        Client.email == email)).scalar_one_or_none()

    if client is None or client.password != password:
        return jsonify({"message": "Wrong email or password"}), 401

    access_token = create_access_token(identity=str(client.id))

    return jsonify({
        "token": access_token,
        "client_id": client.id
    }), 200

# private


@api.route('/private/client', methods=['GET'])
@jwt_required()
def private():
    client_id = int(get_jwt_identity())
    client = db.session.execute(select(Client).where(
        Client.id == client_id)).scalar_one()
    return jsonify(client.serialize()), 200


@api.route('/login/company', methods=["POST"])
def login_company():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    company = db.session.execute(select(Company).where(
        Company.email == email, Company.password == password)).scalar_one_or_none()

    if not company:
        return jsonify({"msg": "Bad email or password"}), 401

    company_token = create_access_token(identity=str(company.id))
    return jsonify({"company_token": company_token}), 200


@api.route("/private/company", methods=["GET"])
@jwt_required()
def private_company():
    company_id = get_jwt_identity()

    company = db.session.get(Company, int(company_id))

    if not company:
        return jsonify({"messagge": "Company not found"}), 404

    return jsonify(company.serialize()), 200


# Company Private Edit
@api.route('/private/company/<int:company_id>', methods=["GET", "PUT"])
@jwt_required()
def company_private_by_id(company_id):
    current_company_id = int(get_jwt_identity())

    if company_id != current_company_id:
        return jsonify({"message": "No tienes permisos para editar esta compañía"}), 403

    company = db.session.execute(select(Company).where(
        Company.id == company_id)).scalar_one_or_none()

    if not company:
        return jsonify({"message": "Compañía no encontrada"}), 404

    if request.method == "GET":
        return jsonify(company.serialize()), 200

    if request.method == "PUT":
        data = request.get_json()
        company.name = data.get("name", company.name)
        company.email = data.get("email", company.email)
        company.cif = data.get("cif", company.cif)
        company.address = data.get("address", company.address)
        company.photo = data.get("photo", company.photo)

        db.session.commit()

        return jsonify(company.serialize()), 200


# All storages Overview


@api.route('/storage/overview', methods=["GET"])
def get_all_storage_overview():

    result = db.session.execute(select(Storage)).scalars().all()

    detailed_list = []
    for storage in result:
        storage_data = storage.serialize()

        location = db.session.get(Location, storage.location_id)
        company = db.session.get(Company, location.company_id)

        storage_data["company_name"] = company.name
        storage_data["city"] = location.city

        detailed_list.append(storage_data)

    return jsonify(detailed_list), 200

# Get Storage Overview


@api.route("/storage/<int:storage_id>/overview", methods=["GET"])
def get_storage_overview(storage_id):
    storage = db.session.execute(select(Storage).where(
        Storage.id == storage_id)).scalar_one_or_none()

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404

    storage_data = storage.serialize()

    location = db.session.get(Location, storage.location_id)
    company = db.session.get(Company, location.company_id)

    storage_data["company_name"] = company.name
    storage_data["city"] = location.city
    storage_data["status"] = "available" if storage.status else "occupied"

    return jsonify(storage_data), 200

# Login admin


@api.route('/login/admin', methods=['POST'])
def login_admin():
    body = request.get_json()
    if body is None:
        return jsonify({"message": "User and Password is mandatory"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    admin = db.session.execute(
        select(AdminUser).where(AdminUser.email == email)
    ).scalar_one_or_none()

    if admin is None or admin.password != password:
        return jsonify({"message": "Wrong email or password"}), 401

    admin_token = create_access_token(identity=str(admin.id))

    return jsonify({
        "admin_token": admin_token,
        "admin": admin.serialize()
    }), 200

# Private admin


@api.route('/private/admin', methods=['GET'])
@jwt_required()
def private_admin():
    admin_id = int(get_jwt_identity())

    admin = db.session.execute(
        select(AdminUser).where(AdminUser.id == admin_id)
    ).scalar_one_or_none()

    if admin is None:
        return jsonify({"message": "Admin not found"}), 404

    return jsonify(admin.serialize()), 200

# # private storages view


@api.route('/private/client/storages', methods=['GET'])
@jwt_required()
def get_client_storages_by_location():
    location_id = request.args.get("location_id", None)

    if location_id is None:
        return jsonify({"message": "location_id query param is required"}), 400

    try:
        location_id = int(location_id)
    except ValueError:
        return jsonify({"message": "location_id must be an integer"}), 400

    result = db.session.execute(select(Storage).where(
        Storage.location_id == location_id)).scalars().all()
    storages = []
    for storage in result:
        storages.append(storage.serialize())

    return jsonify(storages), 200


# Company private locations
@api.route('/private/company/locations', methods=["GET", "POST"])
@jwt_required()
def company_locations():
    company_id = int(get_jwt_identity())

    if request.method == "GET":
        locations = db.session.execute(select(Location).where(
            Location.company_id == company_id)).scalars().all()

        return jsonify([location.serialize() for location in locations]), 200

    if request.method == "POST":
        data = request.get_json()

        address = data.get("address")
        city = data.get("city")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        photo = data.get("photo")

        if not all([address, city, latitude, longitude]):
            return jsonify({"message": "Missing data"}), 400

        new_location = Location(
            address=address,
            city=city,
            latitude=latitude,
            longitude=longitude,
            company_id=company_id,
            photo=photo
        )

        db.session.add(new_location)
        db.session.commit()

        return jsonify(new_location.serialize()), 201


# Company private storages
@api.route('/private/company/storages', methods=["GET"])
@jwt_required()
def get_company_storages():
    company_id = get_jwt_identity()
    storages = db.session.execute(select(Storage).join(Storage.location).where(
        Location.company_id == company_id)).scalars().all()

    return jsonify([storage.serialize() for storage in storages]), 200


# Company private storages ID
@api.route('/private/company/storages/<int:storage_id>', methods=["GET"])
@jwt_required()
def get_company_storage_by_id(storage_id):
    company_id = get_jwt_identity()

    storage = db.session.execute(select(Storage).join(Storage.location).where(
        Storage.id == storage_id, Location.company_id == company_id)).scalar_one_or_none()

    if not storage:
        return jsonify({"message": "Storage not found or not yours"}), 404

    return jsonify(storage.serialize()), 200


# Company private Locations Details

@api.route('/private/company/locations/<int:location_id>', methods=["GET"])
@jwt_required()
def get_company_location_by_id(location_id):
    company_id = int(get_jwt_identity())

    location = db.session.execute(select(Location).where(
        Location.id == location_id, Location.company_id == company_id)).scalar_one_or_none()

    if not location:
        return jsonify({"message": "Location not found or not yours"}), 404

    return jsonify(location.serialize()), 200


# Company private Locations Edit

@api.route('/private/company/locations/<int:location_id>', methods=["GET", "PUT"])
@jwt_required()
def company_location_by_id(location_id):
    company_id = int(get_jwt_identity())

    location = db.session.execute(
        select(Location).where(Location.id == location_id, Location.company_id == company_id)).scalar_one_or_none()

    if not location:
        return jsonify({"message": "Location not found or not yours"}), 404

    if request.method == "GET":
        return jsonify(location.serialize()), 200

    if request.method == "PUT":
        data = request.get_json()

        location.address = data.get("address", location.address)
        location.city = data.get("city", location.city)
        location.latitude = data.get("latitude", location.latitude)
        location.longitude = data.get("longitude", location.longitude)
        location.photo = data.get("photo", location.photo)

        db.session.commit()

        return jsonify(location.serialize()), 200


# Company private Locations Delete

@api.route('/private/company/locations/<int:location_id>', methods=["DELETE"])
@jwt_required()
def delete_company_location(location_id):
    company_id = int(get_jwt_identity())

    location = db.session.execute(select(Location).where(
        Location.id == location_id, Location.company_id == company_id)).scalar_one_or_none()

    if not location:
        return jsonify({"message": "Location not found or not yours"}), 404

    db.session.delete(location)
    db.session.commit()

    return jsonify({"message": "Location deleted"}), 200


# Company private create storage
@api.route('/private/company/storages', methods=['POST'])
@jwt_required()
def create_company_storage():
    company_id = get_jwt_identity()
    data = request.get_json()

    size = data.get("size")
    price = data.get("price")
    location_id = data.get("location_id")
    photo = data.get("photo")

    if not all([size, price, location_id]):
        return jsonify({"message": "Missing data"}), 400

    location = db.session.get(Location, location_id)
    if not location or location.company_id != int(company_id):
        return jsonify({"message": "Invalid location or does not belong to your company"}), 400

    new_storage = Storage(
        size=size,
        price=price,
        location_id=location_id,
        status=True,
        photo=photo
    )

    db.session.add(new_storage)
    db.session.commit()

    return jsonify(new_storage.serialize()), 201


# Company private Storages Edit

@api.route('/private/company/storages/<int:storage_id>', methods=["GET", "PUT"])
@jwt_required()
def company_storage_by_id(storage_id):
    company_id = int(get_jwt_identity())

    storage = db.session.execute(select(Storage).join(Location).where(
        Storage.id == storage_id, Location.company_id == company_id)).scalar_one_or_none()

    if not storage:
        return jsonify({"message": "Storage not found or not yours"}), 404

    if request.method == "GET":
        return jsonify(storage.serialize()), 200

    if request.method == "PUT":
        data = request.get_json()

        storage.size = data.get("size", storage.size)
        storage.price = data.get("price", storage.price)
        storage.location_id = data.get("location_id", storage.location_id)
        storage.photo = data.get("photo", storage.photo)

        if "status" in data:
            storage.status = data.get("status")

        db.session.commit()

        return jsonify(storage.serialize()), 200


# Company Storages Delete

@api.route('/private/company/storages/<int:storage_id>', methods=["DELETE"])
@jwt_required()
def delete_company_storage(storage_id):
    company_id = int(get_jwt_identity())

    storage = db.session.execute(select(Storage).join(Location).where(
        Storage.id == storage_id, Location.company_id == company_id)).scalar_one_or_none()

    if not storage:
        return jsonify({"message": "Storage not found or not yours"}), 404

    db.session.delete(storage)
    db.session.commit()

    return jsonify({"message": "Storage deleted"}), 200


# #  Company Storages by Location

# @api.route('/private/company/locations/<int:location_id>/storages', methods=["GET"])
# @jwt_required()
# def get_storages_by_location(location_id):

#     company_id = int(get_jwt_identity())

#     storages = db.session.execute(select(Storage).join(Location).where(Location.id == location_id, Location.company_id == company_id)).scalars().all()

#     return jsonify([storage.serialize() for storage in storages]), 200


# conseguir todos los storages para los clientes
@api.route('/location/<int:location_id>/storages', methods=['GET'])
@jwt_required()
def get_storages_by_location(location_id):
    try:
        storages = db.session.execute(
            select(Storage).where(Storage.location_id == location_id)
        ).scalars().all()

        result = []

        for storage in storages:
            # Traer solo leases activas vigentes HOY
            leases = db.session.execute(
                select(Leases).where(
                    Leases.storage_id == storage.id,
                    Leases.status == "active",
                    Leases.start_date <= date.today(),
                    Leases.end_date >= date.today()
                )
            ).scalars().all()

            occupied = len(leases) > 0

            storage_data = storage.serialize()
            storage_data["occupied"] = occupied
            storage_data["active_leases_count"] = len(leases)
            result.append(storage_data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# private leases de cliente
@api.route('/client/my-leases', methods=['GET'])
@jwt_required()
def get_my_leases():
    try:
        client_id = get_jwt_identity()

        leases = db.session.execute(
            select(Leases).where(Leases.client_id == client_id)
        ).scalars().all()

        return jsonify([lease.serialize() for lease in leases]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# crear un lease private para cliente


@api.route('/client/leases', methods=['POST'])
@jwt_required()
def create_client_lease():
    try:
        data = request.get_json()
        # cambio ----------------- get_jwt_identity()
        current_client_id = int(get_jwt_identity())

        start_date = data.get("start_date")
        end_date = data.get("end_date")
        storage_id = data.get("storage_id")

        if not all([start_date, end_date, storage_id]):
            return jsonify({"message": "Faltan datos obligatorios"}), 400

        storage = Storage.query.get(storage_id)

        if not storage:
            return jsonify({"message": "Trastero no encontrado"}), 404

        if not storage.status:
            return jsonify({"message": "El trastero ya está ocupado"}), 400

        new_lease = Leases(
            start_date=start_date,
            end_date=end_date,
            status=True,
            client_id=current_client_id,
            storage_id=storage_id
        )

        storage.status = False

        db.session.add(new_lease)
        db.session.commit()

        return jsonify(new_lease.serialize()), 201

    except Exception as e:
        db.session.rollback()
        print("ERROR INTERNO:", e)
        return jsonify({"error": str(e)}), 500

# borrar un lease de cliente

# obsoleto


@api.route('/client/leases/<int:lease_id>', methods=['DELETE'])
@jwt_required()
def delete_client_lease(lease_id):
    try:
        client_id = get_jwt_identity()

        lease = db.session.get(Leases, lease_id)
        if not lease:
            return jsonify({"message": "Lease not found"}), 404

        if lease.client_id != int(client_id):
            return jsonify({"message": "No autorizado"}), 403

        storage = db.session.get(Storage, lease.storage_id)
        if storage:
            storage.status = True
            db.session.add(storage)
        db.session.delete(lease)
        db.session.commit()

        return jsonify({"message": "Reserva cancelada con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        print("ERROR AL CANCELAR LEASE:", e)
        return jsonify({"error": str(e)}), 500


# NO TOCAR ENDPOINT PARA EL MAPA
    # el JOIN entre Storage y Location para Haces 1 sola consulta a la base de datos en lugar de 50 o 100
@api.route('/storage/map', methods=["GET"])
def get_storages_for_map():


    search_lat = request.args.get('lat')
    search_lng = request.args.get('lng')
    checkin = request.args.get('checkin')
    checkout = request.args.get('checkout')

    query = select(Storage, Location).join(
        Location).where(Storage.status == True)

    if checkin and checkout:
        # Buscamos los trasteros que tienen un alquiler que CHOCA con las fechas pedidas
        occupied_subquery = select(Leases.storage_id).where(
            and_(
                Leases.status == True,
                Leases.start_date <= checkout,
                Leases.end_date >= checkin
            )
        )

        print(occupied_subquery)
        print("despues de print occupied-subquery")
        query = query.where(not_(Storage.id.in_(occupied_subquery)))

    results = db.session.execute(query).all()

    results = db.session.execute(query).all()

    final_result = []
    seen_ids = set()

    for storage, location in results:
        if storage.id in seen_ids:
            continue

        data = {
            "storage_id": storage.id,
            "price": storage.price,
            "size": storage.size,
            "latitude": float(location.latitude),
            "longitude": float(location.longitude),
            "city": location.city,
            "address": location.address
        }

        if search_lat and search_lng:

            R = 6371
            s_lat, s_lng = math.radians(
                float(search_lat)), math.radians(float(search_lng))
            t_lat, t_lng = math.radians(float(location.latitude)), math.radians(
                float(location.longitude))

            dlat = t_lat - s_lat
            dlng = t_lng - s_lng

            a = math.sin(dlat/2)**2 + math.cos(s_lat) * \
                math.cos(t_lat) * math.sin(dlng/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            distance = R * c

            if distance > 20:
                continue
            data["distance_km"] = round(distance, 1)

        final_result.append(data)
        seen_ids.add(storage.id)

    return jsonify(final_result), 200

# Get occupancy of storages from location
@api.route("/mycompany/locations-overview", methods=["GET"])
@jwt_required()
def mycompany_locations_overview():

    try:
        company_id = int(get_jwt_identity())

        locations = db.session.execute(select(Location).where(
            Location.company_id == company_id)).scalars().all()

        result = [loc.serialize() for loc in locations]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Storage status per company

@api.route("/private/company/storages-occupancy", methods=["GET"])
@jwt_required()
def company_storages_occupancy():
    company_id = int(get_jwt_identity())

    # Obtener todos los storages de la empresa
    storages = db.session.execute(
        select(Storage).join(Location).where(Location.company_id == company_id)
    ).scalars().all()

    result = []
    for storage in storages:
        # contar leases activas
        active_leases = db.session.execute(
            select(Leases).where(
                Leases.storage_id == storage.id,
                Leases.status == "active",
                Leases.start_date <= sa.func.current_date(),
                Leases.end_date >= sa.func.current_date()
            )
        ).scalars().all()

        storage_data = storage.serialize()
        storage_data["occupied"] = len(active_leases) > 0
        storage_data["active_leases_count"] = len(active_leases)

        result.append(storage_data)

    return jsonify(result), 200


# Endpoint para leases de un storage específico
@api.route("/private/company/storage/<int:storage_id>/leases", methods=["GET"])
@jwt_required()
def storage_leases(storage_id):
    today = date.today()  # <-- usar fecha de Python

    # Traer leases con join a Client para obtener email
    leases = db.session.execute(
        select(Leases, Client.email)
        .join(Client, Leases.client_id == Client.id)
        .where(Leases.storage_id == storage_id)
    ).all()

    result = {"current": [], "past": [], "future": []}

    for lease, email in leases:
        lease_info = {
            "email": email,
            "start_date": lease.start_date.isoformat(),
            "end_date": lease.end_date.isoformat(),
            "status": lease.status
        }

        # Comparar con today de Python
        if lease.end_date < today:
            result["past"].append(lease_info)
        elif lease.start_date > today:
            result["future"].append(lease_info)
        else:
            result["current"].append(lease_info)

    return jsonify(result), 200


# Leases for company
@api.route("/private/company/leases-filtered", methods=["GET"])
@jwt_required()
def get_company_leases_filtered():
    company_id = int(get_jwt_identity())
    today = date.today()

    status_filter = request.args.get("status", None)
    location_id = request.args.get("location_id", None)
    storage_id = request.args.get("storage_id", None)

    query = select(Leases).join(Storage).join(
        Location).where(Location.company_id == company_id)

    if location_id:
        try:
            location_id = int(location_id)
            query = query.where(Storage.location_id == location_id)
        except ValueError:
            return jsonify({"message": "location_id must be an integer"}), 400

    if storage_id:
        try:
            storage_id = int(storage_id)
            query = query.where(Leases.storage_id == storage_id)
        except ValueError:
            return jsonify({"message": "storage_id must be an integer"}), 400

    leases = db.session.execute(query).scalars().all()

    result = {"current": [], "past": [], "future": []}

    for lease in leases:
        lease_info = {
            "id": lease.id,
            "start_date": lease.start_date.isoformat(),
            "end_date": lease.end_date.isoformat(),
            "status": lease.status,
            "storage_id": lease.storage.id,
            "storage_size": lease.storage.size,
            "location_city": lease.storage.location.city,
            "client_email": lease.client.email
        }

        # Clasificar según fechas
        if lease.end_date < today:
            result["past"].append(lease_info)
        elif lease.start_date > today:
            result["future"].append(lease_info)
        else:
            result["current"].append(lease_info)

    # Si se filtró por status temporal, devolver solo ese
    if status_filter in ["current", "past", "future"]:
        return jsonify(result[status_filter]), 200

    return jsonify(result), 200
