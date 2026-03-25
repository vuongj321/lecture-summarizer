"""Change hashed_password to binary

Revision ID: 7e92ce6d2d3b
Revises: 21a8bdd1ebbb
Create Date: 2026-03-23 17:47:53.526987

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e92ce6d2d3b'
down_revision: Union[str, Sequence[str], None] = '21a8bdd1ebbb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE users ALTER COLUMN hashed_password TYPE BYTEA USING hashed_password::bytea"
    )

def downgrade() -> None:
    op.execute(
        "ALTER TABLE users ALTER COLUMN hashed_password TYPE VARCHAR USING hashed_password::text"
    )
