"""add waitlist_entries table

Revision ID: c7f4a8912bad
Revises: 6c28b2a6b871
Create Date: 2026-04-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c7f4a8912bad"
down_revision: Union[str, Sequence[str], None] = "6c28b2a6b871"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "waitlist_entries",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(length=254), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_waitlist_entries_email"),
    )


def downgrade() -> None:
    op.drop_table("waitlist_entries")
