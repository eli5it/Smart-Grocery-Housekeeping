from app import db
from app.models.pantry_entry import PantryEntry
import sqlalchemy as sa
import sqlalchemy.orm as so


class User(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64),
                                                unique=True,
                                                nullable=False)
    password_hash: so.Mapped[str] = so.mapped_column(sa.String(128),
                                                     nullable=False)

    pantry_entries: so.WriteOnlyMapped['PantryEntry'] = so.relationship(
        back_populates='user',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<User {self.username}>'
