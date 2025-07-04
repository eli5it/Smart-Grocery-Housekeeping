from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so

class Recipe(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    description: so.Mapped[str] = so.mapped_column(sa.Text)
    image: so.Mapped[str] = so.mapped_column(sa.String(128))

    def __repr__(self):
        return '<Recipe {}>'.format(self.name)


