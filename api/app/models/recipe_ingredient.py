from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so


class RecipeIngredient(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    ingredient_id: so.Mapped[int] = so.mapped_column(
        sa.ForeignKey('ingredient.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    recipe_id: so.Mapped[int] = so.mapped_column(
        sa.ForeignKey('recipe.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )

    ingredient: so.Mapped['Ingredient'] = so.relationship(
        back_populates='recipe_links'
    )
    recipe: so.Mapped['Recipe'] = so.relationship(
        back_populates='ingredient_links'
    )

    def __repr__(self):
        return f'<RecipeIngredient {self.ingredient_id} in Recipe {self.recipe_id}>'
