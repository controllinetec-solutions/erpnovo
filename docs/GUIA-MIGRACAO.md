# 📊 Guia de Migração de Dados - ERP Lite

Este guia explica como migrar dados de sistemas legados para o ERP Lite.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Preparação](#preparação)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Scripts de Migração](#scripts-de-migração)
5. [Validação](#validação)
6. [Exemplos](#exemplos)

---

## 🎯 Visão Geral

O ERP Lite suporta migração de dados de:
- Sistemas ERP anteriores
- Planilhas Excel/CSV
- Bancos de dados legados
- Outros sistemas de gestão

### Dados Migráveis

- ✅ Empresas e Filiais
- ✅ Usuários e Permissões
- ✅ Produtos e Categorias
- ✅ Clientes
- ✅ Fornecedores
- ✅ Estoque Inicial
- ✅ Saldos Financeiros
- ❌ Vendas (apenas histórico)
- ❌ Documentos Fiscais (reemissão necessária)

---

## 🔧 Preparação

### 1. Backup do Sistema Atual

```bash
# Fazer backup completo antes da migração
mysqldump -u usuario -p banco_antigo > backup_antes_migracao.sql
```

### 2. Exportar Dados do Sistema Antigo

Exporte os dados em formato CSV ou JSON:

```bash
# Exemplo: Exportar produtos do sistema antigo
SELECT 
  codigo,
  descricao,
  codigo_barras,
  preco_custo,
  preco_venda,
  estoque_atual,
  categoria
FROM produtos
WHERE ativo = 1;
```

### 3. Mapear Campos

Crie um mapeamento entre os campos do sistema antigo e o ERP Lite:

| Sistema Antigo | ERP Lite | Observações |
|----------------|----------|-------------|
| codigo | code | Obrigatório |
| descricao | description | Obrigatório |
| codigo_barras | barcode | Opcional |
| preco_custo | costPrice | Decimal(10,2) |
| preco_venda | salePrice | Decimal(10,2) |
| estoque_atual | currentStock | Decimal(10,3) |
| categoria | categoryId | UUID da categoria |

---

## 🗄️ Estrutura de Dados

### Schema do ERP Lite

Consulte o schema completo em `backend/prisma/schema.prisma`.

### Tabelas Principais

```sql
-- Empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NOT NULL,
  document VARCHAR(20) UNIQUE NOT NULL,
  ...
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL,
  code VARCHAR(50) NOT NULL,
  barcode VARCHAR(50) UNIQUE,
  description VARCHAR(255) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  ...
);

-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(20),
  ...
);
```

---

## 📝 Scripts de Migração

### Script Base de Migração

```typescript
// backend/scripts/migrate.ts
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

interface ProductCSV {
  codigo: string;
  descricao: string;
  codigo_barras: string;
  preco_custo: string;
  preco_venda: string;
  estoque_atual: string;
  categoria: string;
}

async function migrateProducts(csvFile: string, storeId: string) {
  console.log('🚀 Iniciando migração de produtos...');
  
  const products: ProductCSV[] = [];
  
  // Ler CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => products.push(row))
      .on('end', resolve)
      .on('error', reject);
  });
  
  console.log(`📦 ${products.length} produtos encontrados`);
  
  // Migrar produtos
  let migrated = 0;
  let errors = 0;
  
  for (const product of products) {
    try {
      // Buscar ou criar categoria
      const category = await prisma.category.upsert({
        where: { name: product.categoria },
        update: {},
        create: {
          id: uuidv4(),
          name: product.categoria,
        },
      });
      
      // Calcular margem
      const costPrice = parseFloat(product.preco_custo);
      const salePrice = parseFloat(product.preco_venda);
      const margin = ((salePrice - costPrice) / salePrice) * 100;
      
      // Criar produto
      await prisma.product.create({
         {
          id: uuidv4(),
          storeId,
          code: product.codigo,
          barcode: product.codigo_barras || null,
          description: product.descricao,
          shortDescription: product.descricao.substring(0, 50),
          categoryId: category.id,
          unit: 'UN',
          ncm: '00000000',
          costPrice,
          salePrice,
          margin,
          minStock: 0,
          currentStock: parseFloat(product.estoque_atual),
          isWeighable: false,
          status: 'ACTIVE',
        },
      });
      
      migrated++;
    } catch (error) {
      console.error(`❌ Erro ao migrar produto ${product.codigo}:`, error);
      errors++;
    }
  }
  
  console.log(`✅ Migração concluída: ${migrated} produtos migrados, ${errors} erros`);
}

// Executar migração
const csvFile = process.argv[2];
const storeId = process.argv[3];

if (!csvFile || !storeId) {
  console.error('Uso: npm run migrate <arquivo.csv> <storeId>');
  process.exit(1);
}

migrateProducts(csvFile, storeId)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Adicionar ao package.json

```json
{
  "scripts": {
    "migrate": "tsx scripts/migrate.ts"
  }
}
```

---

## ✅ Validação

### Checklist de Validação

- [ ] Todos os registros foram migrados
- [ ] Não há dados duplicados
- [ ] Relacionamentos estão corretos
- [ ] Valores monetários estão corretos
- [ ] Estoque está correto
- [ ] Categorias foram criadas
- [ ] Usuários têm permissões corretas

### Scripts de Validação

```typescript
// backend/scripts/validate.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validate() {
  console.log('🔍 Validando dados migrados...\n');
  
  // Contar registros
  const products = await prisma.product.count();
  const customers = await prisma.customer.count();
  const suppliers = await prisma.supplier.count();
  
  console.log(`📦 Produtos: ${products}`);
  console.log(`👥 Clientes: ${customers}`);
  console.log(`🚚 Fornecedores: ${suppliers}`);
  
  // Verificar produtos sem categoria
  const productsWithoutCategory = await prisma.product.count({
    where: { categoryId: null },
  });
  
  if (productsWithoutCategory > 0) {
    console.warn(`⚠️  ${productsWithoutCategory} produtos sem categoria`);
  }
  
  // Verificar estoque negativo
  const negativeStock = await prisma.stockItem.count({
    where: { quantity: { lt: 0 } },
  });
  
  if (negativeStock > 0) {
    console.warn(`⚠️  ${negativeStock} itens com estoque negativo`);
  }
  
  console.log('\n✅ Validação concluída');
}

validate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 📚 Exemplos

### Exemplo 1: Migrar Produtos de CSV

```bash
# 1. Exportar produtos do sistema antigo
# (use o SQL fornecido acima)

# 2. Executar migração
cd backend
npm run migrate ../produtos.csv store-001

# 3. Validar
npm run validate
```

### Exemplo 2: Migrar Clientes de JSON

```typescript
// backend/scripts/migrate-customers.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function migrateCustomers(jsonFile: string, companyId: string) {
  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  
  for (const customer of data) {
    await prisma.customer.create({
       {
        id: uuidv4(),
        companyId,
        name: customer.nome,
        document: customer.cpf_cnpj,
        phone: customer.telefone,
        email: customer.email,
        address: customer.endereco,
        active: true,
      },
    });
  }
  
  console.log(`✅ ${data.length} clientes migrados`);
}
```

### Exemplo 3: Migrar Estoque Inicial

```typescript
// backend/scripts/migrate-stock.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateStock(storeId: string) {
  // Buscar todos os produtos da loja
  const products = await prisma.product.findMany({
    where: { storeId },
  });
  
  // Criar itens de estoque
  for (const product of products) {
    await prisma.stockItem.upsert({
      where: {
        storeId_productId: {
          storeId,
          productId: product.id,
        },
      },
      update: {},
      create: {
        id: uuidv4(),
        storeId,
        productId: product.id,
        quantity: product.currentStock || 0,
      },
    });
  }
  
  console.log(`✅ Estoque inicial migrado para ${products.length} produtos`);
}
```

---

## 🔄 Pós-Migração

### 1. Verificar Dados

```sql
-- Verificar total de registros
SELECT 
  (SELECT COUNT(*) FROM products) as produtos,
  (SELECT COUNT(*) FROM customers) as clientes,
  (SELECT COUNT(*) FROM suppliers) as fornecedores;

-- Verificar produtos sem estoque
SELECT code, description, current_stock
FROM products
WHERE current_stock <= min_stock;
```

### 2. Ajustar Configurações

- Revisar categorias
- Ajustar estoques mínimos
- Configurar permissões de usuários
- Verificar formas de pagamento

### 3. Treinar Usuários

- Mostrar novas funcionalidades
- Explicar diferenças do sistema anterior
- Fornecer manual do usuário

### 4. Monitorar

- Acompanhar primeiras vendas
- Verificar sincronização com PDV
- Monitorar performance

---

## ⚠️ Cuidados Importantes

### Antes da Migração

- ✅ Fazer backup completo
- ✅ Testar em ambiente de desenvolvimento
- ✅ Validar dados de origem
- ✅ Planejar janela de manutenção

### Durante a Migração

- ✅ Migrar em ordem: Empresas → Produtos → Clientes → Estoque
- ✅ Validar após cada etapa
- ✅ Manter logs detalhados
- ✅ Ter plano de rollback

### Após a Migração

- ✅ Validar todos os dados
- ✅ Testar funcionalidades críticas
- ✅ Treinar usuários
- ✅ Monitorar por pelo menos 1 semana

---

## 🆘 Suporte

Se precisar de ajuda na migração:

1. **Consulte a documentação**
   - [Manual do Desenvolvedor](./MANUAL-DESENVOLVEDOR.md)
   - Schema do banco: `backend/prisma/schema.prisma`

2. **Entre em contato**
   - Email: suporte@erplite.com.br
   - Horário: Seg a Sex, 8h às 18h

3. **Contrate consultoria**
   - Podemos ajudar na migração completa
   - Treinamento de equipe
   - Suporte dedicado

---

**ERP Lite** - Guia de Migração de Dados v1.0
