from app import db
from app.models.pantry_entry import PantryEntry
from app.models.recipe_ingredient import RecipeIngredient
import sqlalchemy as sa
import sqlalchemy.orm as so


class Ingredient(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(64),
                                            index=True,
                                            unique=True,
                                            nullable=False)

    pantry_entries: so.WriteOnlyMapped['PantryEntry'] = so.relationship(
        back_populates='ingredient',
        cascade='all, delete-orphan'
    )

    recipe_links: so.WriteOnlyMapped['RecipeIngredient'] = so.relationship(
        back_populates='ingredient',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return '<Ingredient {}>'.format(self.name)
