"""Initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-01-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Companies
    op.create_table(
        'companies',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('trade_name', sa.String(255), nullable=False),
        sa.Column('document', sa.String(20), unique=True, nullable=False),
        sa.Column('state_registration', sa.String(20), nullable=True),
        sa.Column('address', sa.String(255), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(2), nullable=False),
        sa.Column('zip_code', sa.String(10), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('segment', sa.String(50), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Stores
    op.create_table(
        'stores',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('code', sa.String(10), nullable=False),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id'), nullable=False),
        sa.Column('address', sa.String(255), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(2), nullable=False),
        sa.Column('zip_code', sa.String(10), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id'), nullable=False),
        sa.Column('store_id', sa.String(36), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('role', sa.String(50), nullable=False, default='OPERATOR'),
        sa.Column('permissions', postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, default=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Categories
    op.create_table(
        'categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('parent_id', sa.String(36), sa.ForeignKey('categories.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Brands
    op.create_table(
        'brands',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), unique=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Products
    op.create_table(
        'products',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('store_id', sa.String(36), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('code', sa.String(50), nullable=False),
        sa.Column('barcode', sa.String(50), unique=True, nullable=True, index=True),
        sa.Column('description', sa.String(255), nullable=False),
        sa.Column('short_description', sa.String(100), nullable=False),
        sa.Column('category_id', sa.String(36), sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('brand_id', sa.String(36), sa.ForeignKey('brands.id'), nullable=True),
        sa.Column('unit', sa.String(10), nullable=False),
        sa.Column('ncm', sa.String(20), nullable=False),
        sa.Column('cest', sa.String(20), nullable=True),
        sa.Column('icms_cst', sa.String(10), nullable=False, default='00'),
        sa.Column('cost_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('sale_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('margin', sa.Numeric(5, 2), nullable=False),
        sa.Column('min_stock', sa.Integer(), nullable=False, default=0),
        sa.Column('max_stock', sa.Integer(), nullable=True),
        sa.Column('is_weighable', sa.Boolean(), nullable=False, default=False),
        sa.Column('scale_code', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(20), nullable=False, default='ACTIVE'),
        sa.Column('version', sa.Integer(), nullable=False, default=1),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Customers
    op.create_table(
        'customers',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('document', sa.String(20), nullable=True, index=True),
        sa.Column('document_type', sa.String(10), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('address', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(2), nullable=True),
        sa.Column('zip_code', sa.String(10), nullable=True),
        sa.Column('total_purchases', sa.Numeric(10, 2), nullable=False, default=0),
        sa.Column('active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Suppliers
    op.create_table(
        'suppliers',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('trade_name', sa.String(255), nullable=True),
        sa.Column('document', sa.String(20), unique=True, nullable=False),
        sa.Column('document_type', sa.String(10), nullable=False),
        sa.Column('state_registration', sa.String(20), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('address', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(2), nullable=True),
        sa.Column('zip_code', sa.String(10), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Terminals
    op.create_table(
        'terminals',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('store_id', sa.String(36), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('token', sa.String(255), unique=True, nullable=False),
        sa.Column('status', sa.String(20), nullable=False, default='OFFLINE'),
        sa.Column('pdv_version', sa.String(20), nullable=True),
        sa.Column('last_sync', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_access', sa.DateTime(timezone=True), nullable=True),
        sa.Column('sync_cursor', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Sales
    op.create_table(
        'sales',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('sale_id', sa.String(36), unique=True, nullable=False, index=True),
        sa.Column('store_id', sa.String(36), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('terminal_id', sa.String(36), sa.ForeignKey('terminals.id'), nullable=False),
        sa.Column('operator_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('customer_id', sa.String(36), sa.ForeignKey('customers.id'), nullable=True),
        sa.Column('date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('discount', sa.Numeric(10, 2), nullable=False, default=0),
        sa.Column('total', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, default='COMPLETED'),
        sa.Column('fiscal_doc_id', sa.String(36), nullable=True),
        sa.Column('synced', sa.Boolean(), nullable=False, default=False),
        sa.Column('sync_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Sale Items
    op.create_table(
        'sale_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales.id'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('description', sa.String(255), nullable=False),
        sa.Column('barcode', sa.String(50), nullable=True),
        sa.Column('quantity', sa.Numeric(10, 3), nullable=False),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('discount', sa.Numeric(10, 2), nullable=False, default=0),
        sa.Column('total', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_weighable', sa.Boolean(), nullable=False, default=False),
        sa.Column('weight', sa.Numeric(10, 3), nullable=True),
    )

    # Sale Payments
    op.create_table(
        'sale_payments',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales.id'), nullable=False),
        sa.Column('type', sa.String(20), nullable=False),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('reference', sa.String(100), nullable=True),
    )

    # Stock Items
    op.create_table(
        'stock_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('store_id', sa.String(36), sa.ForeignKey('stores.id'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('quantity', sa.Numeric(10, 3), nullable=False, default=0),
        sa.UniqueConstraint('store_id', 'product_id'),
    )

    # Stock Movements
    op.create_table(
        'stock_movements',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('stock_item_id', sa.String(36), sa.ForeignKey('stock_items.id'), nullable=False),
        sa.Column('type', sa.String(30), nullable=False),
        sa.Column('quantity', sa.Numeric(10, 3), nullable=False),
        sa.Column('previous_qty', sa.Numeric(10, 3), nullable=False),
        sa.Column('new_qty', sa.Numeric(10, 3), nullable=False),
        sa.Column('unit_cost', sa.Numeric(10, 2), nullable=True),
        sa.Column('origin', sa.String(255), nullable=False),
        sa.Column('reference_id', sa.String(36), nullable=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Índices
    op.create_index('ix_products_store_id', 'products', ['store_id'])
    op.create_index('ix_sales_date', 'sales', ['date'])
    op.create_index('ix_sales_store_date', 'sales', ['store_id', 'date'])
    op.create_index('ix_stock_movements_created_at', 'stock_movements', ['created_at'])


def downgrade() -> None:
    op.drop_table('stock_movements')
    op.drop_table('stock_items')
    op.drop_table('sale_payments')
    op.drop_table('sale_items')
    op.drop_table('sales')
    op.drop_table('terminals')
    op.drop_table('suppliers')
    op.drop_table('customers')
    op.drop_table('products')
    op.drop_table('brands')
    op.drop_table('categories')
    op.drop_table('users')
    op.drop_table('stores')
    op.drop_table('companies')
