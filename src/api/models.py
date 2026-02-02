from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class AdminUser(db.Model):
    __tablename__ = "admin_user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Client(db.Model):
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
        }


class Company(db.Model):

    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    cif: Mapped[str] = mapped_column(unique=True, nullable=False)
    address: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    # locations: Mapped[list["Location"]] = relationship(back_populates="company", cascade= "all, delete-orphan")

    def serialize(self):
        
        return {

            "id": self.id,
            "name": self.name,
            "cif": self.cif,
            "address": self.address,
            "email": self.email
        }

class Leases(db.Model):

    __tablename__ = "leases"

    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[str] = mapped_column(nullable=False)
    end_date: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    storage_id: Mapped[int] = mapped_column(ForeignKey("storage.id"), nullable=False)

    # user: Mapped["User"] = relationship(back_populates="leases")
    # storage: Mapped["Storage"] = relationship(back_populates="leases")

    def serialize(self):
        return {
            "id": self.id,
            "start_date":self.start_date, 
            "end_date":self.end_date, 
            "status":self.status, 
            "user_id":self.user_id, 
            "storage_id":self.storage_id 
        }

class Storage(db.Model):

     __tablename__ = "storage"

     id: Mapped[int] = mapped_column(primary_key=True)
     size: Mapped[str] = mapped_column(nullable=False)
     price: Mapped[float] = mapped_column(nullable=False)
     status: Mapped[str] = mapped_column(nullable=False)
     location_id: Mapped[int] = mapped_column(ForeignKey("location.id"), nullable=False)

    #  location: Mapped["Location"] = relationship(back_populates="storages")
    #  leases: Mapped[list["Leases"]] = relationship(back_populates="storage")

     def serialize(self):
         return {
             "id": self.id,
             "size": self.size,
             "price": self.price,
             "status": self.status,
             "location_id": self.location_id
         }


class Location(db.Model):

    __tablename__ = "location"

    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(primary_key=False)
    city: Mapped[str] = mapped_column(nullable=False)
    latitude: Mapped[float] = mapped_column(nullable=False)
    longitude: Mapped[float] = mapped_column(nullable=False)
     
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    company: Mapped["Company"] = relationship(back_populates="locations")

    # storages: Mapped[list["Storage"]] = relationship(back_populates="location")

    def serialize(self):
        return {
            "id":self.id,
            "address": self.address,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "company_id": self.company_id
        }
         