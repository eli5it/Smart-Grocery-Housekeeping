from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from app.models.recipe_ingredient import RecipeIngredient


class Recipe(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(
        sa.String(64), index=True
    )
    instructions: so.Mapped[list[str]] = so.mapped_column(
        sa.JSON, nullable=True
    )
    ingredients: so.Mapped[list[str]] = so.mapped_column(
        sa.JSON, nullable=True
    )

    ingredient_links: so.Mapped[list['RecipeIngredient']] = so.relationship(
        back_populates='recipe',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Recipe {self.name}>'
