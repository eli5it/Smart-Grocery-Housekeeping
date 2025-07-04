from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from datetime import datetime, timezone
from typing import Optional

class PantryEntry(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    expiration_date: so.Mapped[Optional[datetime]] = so.mapped_column()

    def __repr__(self):
        return '<PantryEntry {}>'.format(self.name)


