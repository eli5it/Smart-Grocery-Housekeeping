from app import db
from app.models.pantry_entry import PantryEntry
import sqlalchemy as sa
import sqlalchemy.orm as so


class Ingredient(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(64),
                                            index=True, unique=True)
    image: so.Mapped[str] = so.mapped_column(sa.String(128), index=True)
    aisle: so.Mapped[str] = so.mapped_column(sa.String(64), index=True)

    pantry_entries: so.WriteOnlyMapped['PantryEntry'] = so.relationship(
        back_populates='ingredient',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return '<Ingredient {}>'.format(self.name)
