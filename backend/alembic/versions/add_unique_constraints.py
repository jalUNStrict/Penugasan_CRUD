"""Add unique constraints to prevent duplicates

Revision ID: add_unique_constraints
Revises: 088dba899e6d
Create Date: 2026-05-11 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_unique_constraints'
down_revision: Union[str, Sequence[str], None] = 'e78ea68f3a87'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Add UNIQUE constraints."""
    
    # Add UNIQUE constraint to user.whatsapp_number
    op.create_unique_constraint('uq_user_whatsapp_number', 'user', ['whatsapp_number'])
    
    # Add UNIQUE constraints to account
    op.create_unique_constraint('uq_account_email', 'account', ['email'])
    op.create_unique_constraint('uq_account_username', 'account', ['username'])
    
    # Add UNIQUE constraint to role.name
    op.create_unique_constraint('uq_role_name', 'role', ['name'])
    
    # Add UNIQUE constraint to event.name
    op.create_unique_constraint('uq_event_name', 'event', ['name'])
    
    # Add composite UNIQUE constraint to registration (user_id, event_id)
    op.create_unique_constraint('uq_registration_user_event', 'registration', ['user_id', 'event_id'])


def downgrade() -> None:
    """Downgrade schema - Remove UNIQUE constraints."""
    
    op.drop_constraint('uq_registration_user_event', 'registration', type_='unique')
    op.drop_constraint('uq_event_name', 'event', type_='unique')
    op.drop_constraint('uq_role_name', 'role', type_='unique')
    op.drop_constraint('uq_account_username', 'account', type_='unique')
    op.drop_constraint('uq_account_email', 'account', type_='unique')
    op.drop_constraint('uq_user_whatsapp_number', 'user', type_='unique')
