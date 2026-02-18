from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date

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
    photo_url: Mapped[str] = mapped_column(String(500), nullable=True)

    leases: Mapped[list["Leases"]] = relationship(
        back_populates="client", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "photo_url": self.photo_url
        }


class Company(db.Model):

    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    cif: Mapped[str] = mapped_column(unique=True, nullable=False)
    address: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    photo: Mapped[str] = mapped_column(nullable=True)

    locations: Mapped[list["Location"]] = relationship(
        back_populates="company", cascade="all, delete-orphan")

    def serialize(self):

        return {
            "id": self.id,
            "name": self.name,
            "cif": self.cif,
            "address": self.address,
            "email": self.email,
            "photo": self.photo
        }


class Leases(db.Model):

    __tablename__ = "leases"

    id: Mapped[int] = mapped_column(primary_key=True)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    status: Mapped[str] = mapped_column(String(20), default="active")

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    storage_id: Mapped[int] = mapped_column(
        ForeignKey("storage.id"), nullable=False)

    client: Mapped["Client"] = relationship(back_populates="leases")
    storage: Mapped["Storage"] = relationship(back_populates="leases") 

    def serialize(self):
        return {
            "id": self.id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "status": self.status,
            "client_id": self.client_id,
            "storage_id": self.storage_id
        }


class Storage(db.Model):

    __tablename__ = "storage"

    id: Mapped[int] = mapped_column(primary_key=True)
    size: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[bool] = mapped_column(nullable=False, default=True)
    photo: Mapped[str] = mapped_column(nullable=True)

    location_id: Mapped[int] = mapped_column(
        ForeignKey("location.id"), nullable=False)

    location: Mapped["Location"] = relationship(back_populates="storages")
    leases: Mapped[list["Leases"]] = relationship(
        back_populates="storage", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "size": self.size,
            "price": self.price,
            "status": self.status,
            "location_id": self.location_id,
            "photo": self.photo
        }


class Location(db.Model):

    __tablename__ = "location"

    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(primary_key=False)
    city: Mapped[str] = mapped_column(nullable=False)
    latitude: Mapped[str] = mapped_column(nullable=False)
    longitude: Mapped[str] = mapped_column(nullable=False)
    photo: Mapped[str] = mapped_column(nullable=True)

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"), nullable=False)

    company: Mapped["Company"] = relationship(back_populates="locations")
    storages: Mapped[list["Storage"]] = relationship(
        back_populates="location", cascade="all, delete-orphan")

    def serialize(self):
        total_storages = len(self.storages)
        occupied_storages = sum(1 for s in self.storages if s.status)
        available_storages = total_storages - occupied_storages

        return {
            "id": self.id,
            "address": self.address,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo": self.photo,
            "company_id": self.company_id,
            "company_name": self.company.name,
            "total_storages": total_storages,
            "occupied_storages": occupied_storages,
            "available_storages": available_storages
        }

