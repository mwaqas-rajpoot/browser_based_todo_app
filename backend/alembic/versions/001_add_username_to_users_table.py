"""Add username to users table

Revision ID: 001
Revises:
Create Date: 2026-02-05 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid
from datetime import datetime


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add username column to users table
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=100), nullable=True))

    # Update existing records with a default username based on email
    connection = op.get_bind()
    connection.execute(
        "UPDATE users SET username = SUBSTR(email, 1, INSTR(email, '@') - 1) WHERE username IS NULL OR username = ''"
    )

    # Make username non-nullable and unique
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('username', nullable=False)
        batch_op.create_index('ix_users_username', ['username'], unique=True)


def downgrade():
    # Remove username column
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_index('ix_users_username')
        batch_op.drop_column('username')