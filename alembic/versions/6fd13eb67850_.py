"""empty message

Revision ID: 6fd13eb67850
Revises: 23fd01b846e8
Create Date: 2022-12-11 10:10:23.085774

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "6fd13eb67850"
down_revision = "23fd01b846e8"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "player_optins",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("playersteamid_id", sa.Integer(), nullable=False),
        sa.Column("optin_name", sa.String(), nullable=False),
        sa.Column("optin_value", sa.String(), nullable=True),
        sa.Column("modified", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["playersteamid_id"],
            ["steam_id_64.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "playersteamid_id", "optin_name", name="unique_optins_steamid"
        ),
    )
    op.create_index(
        op.f("ix_player_optins_optin_name"),
        "player_optins",
        ["optin_name"],
        unique=False,
    )
    op.create_index(
        op.f("ix_player_optins_playersteamid_id"),
        "player_optins",
        ["playersteamid_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_player_vip_playersteamid_id"),
        "player_vip",
        ["playersteamid_id"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_player_vip_playersteamid_id"), table_name="player_vip")
    op.drop_index(op.f("ix_player_optins_playersteamid_id"), table_name="player_optins")
    op.drop_index(op.f("ix_player_optins_optin_name"), table_name="player_optins")
    op.drop_table("player_optins")
    # ### end Alembic commands ###
