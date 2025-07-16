from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from datetime import date
import enum


class PantryStatus(enum.StrEnum):
    IN_STOCK = "in_stock"
    LOW = "low"
    OUT_OF_STOCK = "out_of_stock"
    EXPIRED = "expired"


class PantryEntry(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    ingredient_id: so.Mapped[int] = so.mapped_column(
        sa.ForeignKey('ingredient.id', ondelete='CASCADE'),
        nullable=False,
        index=True)
    user_id: so.Mapped[int] = so.mapped_column(
        sa.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False,
        index=True)
    expiration_date: so.Mapped[date | None] = so.mapped_column(nullable=True)
    date_added: so.Mapped[date] = so.mapped_column(default=date.today,
                                                   nullable=False)
    status: so.Mapped[PantryStatus] = so.mapped_column(
        sa.Enum(PantryStatus, native_enum=False),
        default=PantryStatus.IN_STOCK,
        nullable=False)

    ingredient: so.Mapped['Ingredient'] = so.relationship(
        back_populates='pantry_entries'
    )
    user: so.Mapped['User'] = so.relationship(back_populates='pantry_entries')

    def __repr__(self):
        return f'<PantryEntry {self.user.username} - {self.ingredient.name}>'
