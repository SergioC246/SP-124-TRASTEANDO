from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Company(db.Model):

    __tablename__= "companies"

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

