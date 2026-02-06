"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, AdminUser, Client, Company, Leases, Location, Storage
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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

        new_location = Location(address=address, city=city, latitude=latitude, longitude=longitude, company_id=company_id)
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
        return jsonify({"message":"Lease not found"}), 404
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
        start_date = start_date,
        end_date = end_date,
        status = status,
        client_id = client_id,
        storage_id =storage_id
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

@api.route("/storage", methods=["GET", "POST"])
def storage():
    print("Acabas de entrar a esta funcion")
    if request.method == "POST":
        data = request.get_json()

        size = data.get("size")
        price = data.get("price")
        status = data.get("status", "available")
        location_id = data.get("location_id")

        if not all([size, price, location_id]):
            return jsonify({"message": "Missing data"}), 400
        
        new_storage = Storage(
            size=size,
            price=price,
            status=status,
            location_id=location_id
        )

        db.session.add(new_storage)
        db.session.commit()

        return jsonify(new_storage.serialize()), 201
    else:
        print("Vas a hacer un GET de todos los Storage")
        result = db.session.execute(select(Storage)).scalars().all()
        return jsonify([storage.serialize() for storage in result]), 200
    
# Get Storage
@api.route("/storage/<int:storage_id>", methods=["GET"])
def get_storage(storage_id):
    storage = db.session.execute(select(Storage).where(Storage.id == storage_id)).scalar_one_or_none()

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404

    return jsonify(storage.serialize()),200



# Update Storage

@api.route('/storage/<int:storage_id>', methods=["PUT"])
def upadate_storage(storage_id):
    storage = db.session.get(Storage, storage_id)

    if storage is None:
        return jsonify({"message": "Storage not found"}), 404
    
    data = request.get_json()

    storage.size = data.get("size", storage.size)
    storage.price = data.get("price", storage.price)
    storage.location = data.get("location", storage.location)
    storage.location_id = data.get("location_id", storage.location_id)

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
        return jsonify({"message":"Bad request"}), 400
    
    email = body.get("email")
    password = body.get("password")

    client = db.session.execute(select(Client).where(Client.email == email)).scalar_one_or_none()

    if client is None or client.password != password:
        return jsonify({"message":"Wrong email or password"}), 401

    access_token = create_access_token(identity=str(client.id))
   
    return jsonify({
        "token":access_token,
        "client_id":client.id
    }), 200

# private

@api.route('/private/client', methods=['GET'])
@jwt_required()
def private():
    client_id = int(get_jwt_identity())
    client = db.session.execute(select(Client).where(Client.id == client_id)).scalar_one()
    return jsonify(client.serialize()),200