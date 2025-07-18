from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so



class Recipe(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(
        sa.String(64), index=True, unique=True
    )
    description: so.Mapped[dict] = so.mapped_column(sa.JSON, nullable=True)
    ingredients: so.Mapped[list[str]] = so.mapped_column(
        sa.JSON, nullable=True
    )

    ingredient_links: so.WriteOnlyMapped['RecipeIngredient'] = so.relationship(
        back_populates='recipe',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Recipe {self.name}>'
