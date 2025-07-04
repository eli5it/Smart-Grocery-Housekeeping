from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so

class Ingredient(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    image: so.Mapped[str] = so.mapped_column(sa.String(128), index=True)

    def __repr__(self):
        return '<Ingredient {}>'.format(self.name)



