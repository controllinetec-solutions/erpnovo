import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ============================================
  // TENANT
  // ============================================
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-001' },
    update: {},
    create: {
      id: 'tenant-001',
      name: 'Mercado Silva',
      plan: 'pro',
      active: true,
    },
  });
  console.log('✅ Tenant criado:', tenant.name);

  // ============================================
  // EMPRESA
  // ============================================
  const company = await prisma.company.upsert({
    where: { id: 'company-001' },
    update: {},
    create: {
      id: 'company-001',
      tenantId: tenant.id,
      name: 'Mercado Silva Ltda',
      tradeName: 'Mercado Silva',
      document: '12.345.678/0001-90',
      stateRegistration: '001.234.567.890',
      address: 'Rua das Flores, 123 - Centro',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-000',
      phone: '(31) 3333-1234',
      email: 'contato@mercadosilva.com.br',
      segment: 'mercado',
      active: true,
    },
  });
  console.log('✅ Empresa criada:', company.name);

  // ============================================
  // LOJAS
  // ============================================
  const store1 = await prisma.store.upsert({
    where: { id: 'store-001' },
    update: {},
    create: {
      id: 'store-001',
      companyId: company.id,
      name: 'Loja 01 - Centro',
      code: '001',
      address: 'Rua das Flores, 123 - Centro',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-000',
      phone: '(31) 3333-1234',
      active: true,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { id: 'store-002' },
    update: {},
    create: {
      id: 'store-002',
      companyId: company.id,
      name: 'Loja 02 - Bairro Norte',
      code: '002',
      address: 'Av. Brasil, 456 - Bairro Norte',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30140-000',
      phone: '(31) 3333-5678',
      active: true,
    },
  });
  console.log('✅ Lojas criadas:', store1.name, store2.name);

  // ============================================
  // USUÁRIOS
  // ============================================
  const passwordHash = await bcrypt.hash('admin123', 10);
  const managerPasswordHash = await bcrypt.hash('gerente123', 10);
  const operatorPasswordHash = await bcrypt.hash('operador123', 10);

  const admin = await prisma.user.upsert({
    where: { id: 'user-admin' },
    update: {},
    create: {
      id: 'user-admin',
      companyId: company.id,
      storeId: store1.id,
      name: 'Admin Master',
      email: 'admin@erplite.com.br',
      passwordHash,
      role: 'ADMIN',
      permissions: [
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'stock.view', 'stock.adjust',
        'sales.view', 'sales.cancel',
        'finance.view', 'finance.manage',
        'customers.view', 'customers.create', 'customers.edit',
        'suppliers.view', 'suppliers.create',
        'reports.view',
        'settings.manage',
        'users.manage',
        'pdv.monitor',
      ],
      active: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { id: 'user-manager' },
    update: {},
    create: {
      id: 'user-manager',
      companyId: company.id,
      storeId: store1.id,
      name: 'Maria Silva',
      email: 'gerente@erplite.com.br',
      passwordHash: managerPasswordHash,
      role: 'MANAGER',
      permissions: [
        'products.view', 'products.create', 'products.edit',
        'stock.view', 'stock.adjust',
        'sales.view', 'sales.cancel',
        'finance.view',
        'customers.view', 'customers.create', 'customers.edit',
        'suppliers.view',
        'reports.view',
        'pdv.monitor',
      ],
      active: true,
    },
  });

  const operator = await prisma.user.upsert({
    where: { id: 'user-operator' },
    update: {},
    create: {
      id: 'user-operator',
      companyId: company.id,
      storeId: store1.id,
      name: 'Carlos Oliveira',
      email: 'operador@erplite.com.br',
      passwordHash: operatorPasswordHash,
      role: 'OPERATOR',
      permissions: [
        'products.view',
        'stock.view',
        'sales.view',
        'customers.view',
      ],
      active: true,
    },
  });
  console.log('✅ Usuários criados:', admin.name, manager.name, operator.name);

  // ============================================
  // CATEGORIAS
  // ============================================
  const categories = [
    { name: 'Mercearia' },
    { name: 'Hortifrúti' },
    { name: 'Padaria' },
    { name: 'Bebidas' },
    { name: 'Laticínios' },
    { name: 'Higiene' },
    { name: 'Limpeza' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: `cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: cat.name,
      },
    });
  }
  console.log('✅ Categorias criadas:', categories.length);

  // ============================================
  // PRODUTOS (Exemplo)
  // ============================================
  const products = [
    {
      code: '001',
      barcode: '7891000100103',
      description: 'Arroz Tipo 1 Camil 5kg',
      shortDescription: 'Arroz Camil 5kg',
      categoryId: 'cat-mercearia',
      unit: 'UN',
      ncm: '10063021',
      costPrice: 18.50,
      salePrice: 24.90,
      margin: 25.7,
      minStock: 20,
      isWeighable: false,
    },
    {
      code: '002',
      barcode: '7891000200209',
      description: 'Feijão Carioca Kicaldo 1kg',
      shortDescription: 'Feijão Kicaldo 1kg',
      categoryId: 'cat-mercearia',
      unit: 'UN',
      ncm: '07133319',
      costPrice: 6.80,
      salePrice: 9.90,
      margin: 31.3,
      minStock: 30,
      isWeighable: false,
    },
    {
      code: '003',
      barcode: '2000001000000',
      description: 'Banana Prata kg',
      shortDescription: 'Banana Prata',
      categoryId: 'cat-hortifrúti',
      unit: 'KG',
      ncm: '08030000',
      costPrice: 3.20,
      salePrice: 5.99,
      margin: 46.6,
      minStock: 10,
      isWeighable: true,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: {
        storeId_code: {
          storeId: store1.id,
          code: prod.code,
        },
      },
      update: {},
      create: {
        storeId: store1.id,
        ...prod,
        status: 'ACTIVE',
      },
    });
  }
  console.log('✅ Produtos criados:', products.length);

  // ============================================
  // TERMINAIS PDV
  // ============================================
  const terminals = [
    { name: 'PDV 01', token: 'pdv-token-001' },
    { name: 'PDV 02', token: 'pdv-token-002' },
    { name: 'PDV 03', token: 'pdv-token-003' },
  ];

  for (const term of terminals) {
    await prisma.terminal.upsert({
      where: { id: `terminal-${term.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: {},
      create: {
        id: `terminal-${term.name.replace(/\s+/g, '-').toLowerCase()}`,
        storeId: store1.id,
        name: term.name,
        token: term.token,
        status: 'OFFLINE',
      },
    });
  }
  console.log('✅ Terminais criados:', terminals.length);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Admin: admin@erplite.com.br / admin123');
  console.log('   Gerente: gerente@erplite.com.br / gerente123');
  console.log('   Operador: operador@erplite.com.br / operador123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
