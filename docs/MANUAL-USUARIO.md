# 📖 Manual do Usuário - ERP Lite

## 🎯 Introdução

Bem-vindo ao **ERP Lite**, o sistema de gestão completo para mercados, padarias, hortifrútis e mercearias. Este manual irá guiá-lo por todas as funcionalidades do sistema.

---

## 🔐 Acesso ao Sistema

### Primeira vez

1. Acesse o endereço do sistema no navegador
2. Informe suas credenciais (e-mail e senha)
3. Clique em "Entrar no Sistema"

### Perfis de Usuário

| Perfil | O que pode fazer |
|--------|------------------|
| **Administrador** | Acesso total: tudo |
| **Gerente** | Produtos, estoque, vendas, clientes, relatórios |
| **Operador** | Visualizar produtos, estoque, vendas e clientes |

---

## 📊 Dashboard

O Dashboard é a tela inicial e apresenta uma visão geral do seu negócio:

### Indicadores Principais

- **Faturamento Hoje** - Total vendido no dia
- **Ticket Médio** - Valor médio por venda
- **Faturamento Mensal** - Total do mês atual
- **Alertas** - Produtos com estoque baixo

### Gráficos

- **Vendas da Semana** - Gráfico de barras com vendas dos últimos 7 dias
- **Vendas por Categoria** - Gráfico de pizza com distribuição
- **Produtos Mais Vendidos** - Top 5 produtos
- **Evolução do Faturamento** - Gráfico de linha

### Status dos PDVs

Visualize rapidamente quais terminais estão:
- 🟢 **Online** - Funcionando normalmente
- 🟡 **Sincronizando** - Enviando dados
- 🔴 **Offline** - Sem conexão
- ⚠️ **Erro** - Problema detectado

---

## 📦 Produtos

### Listagem

Veja todos os produtos com:
- Código de barras
- Descrição completa
- Categoria e marca
- Preços (custo e venda)
- Margem de lucro
- Estoque atual

### Busca e Filtros

- Busque por nome, código de barras ou código interno
- Filtre por categoria
- Use filtros avançados para refinar resultados

### Cadastro de Produto

1. Clique em "Novo Produto"
2. Preencha os dados:
   - **Código Interno** - Identificação única
   - **Código de Barras/GTIN** - Para leitura no PDV
   - **Descrição** - Nome completo do produto
   - **Descrição Reduzida** - Para cupom fiscal
   - **Categoria** - Classificação
   - **Marca** - Fabricante
   - **Unidade** - UN, KG, G, L, ML, CX, PCT, FD
   - **NCM** - Classificação fiscal
   - **Preço de Custo** - Valor de compra
   - **Preço de Venda** - Valor para o cliente
   - **Estoque Mínimo** - Alerta de reposição
   - **Produto Pesável** - Para balança

### Produtos Pesáveis

Para produtos vendidos por peso (frutas, frios, etc):
- Marque "Produto Pesável"
- O PDV se comunicará com a balança automaticamente
- Preço é calculado por kg

---

## 📊 Estoque

### Posição de Estoque

Visualize o estoque atual de todos os produtos:
- Quantidade em estoque
- Estoque mínimo e máximo
- Valor total em estoque
- Status (Normal, Baixo, Sem Estoque)

### Movimentações

Acompanhe todas as movimentações:
- **Entradas** - Compras, ajustes positivos
- **Saídas** - Vendas, perdas
- **Transferências** - Entre lojas
- **Ajustes** - Inventário

### Inventário

Realize contagem física:
1. Clique em "Iniciar Novo Inventário"
2. Conte os produtos fisicamente
3. Informe as quantidades
4. O sistema calculará as diferenças
5. Ajuste o estoque

---

## 🛒 Vendas

### Histórico de Vendas

Veja todas as vendas realizadas no PDV:
- ID único da venda (UUID)
- Data e hora
- Operador que realizou
- PDV e loja
- Cliente
- Itens e total
- Forma de pagamento
- Status (Concluída, Cancelada)
- Sincronização com ERP

### Detalhes da Venda

Clique no ícone de olho para ver:
- Todos os itens vendidos
- Valores unitários
- Descontos aplicados
- Formas de pagamento
- Status de sincronização

### Cancelamento

Para cancelar uma venda:
1. Localize a venda
2. Clique no ícone de cancelamento
3. Informe o motivo
4. Confirme o cancelamento
5. Estoque é estornado automaticamente

---

## 💰 Caixa

### Caixas Abertos

Veja os caixas em operação:
- Terminal e operador
- Valor de abertura
- Total de vendas
- Sangrias realizadas
- Suprimentos
- Valor esperado no fechamento

### Sangria

Retire dinheiro do caixa:
1. Clique em "Sangria"
2. Informe o valor
3. Descreva o motivo
4. Confirme

### Suprimento

Adicione dinheiro ao caixa:
1. Clique em "Suprimento"
2. Informe o valor
3. Descreva o motivo
4. Confirme

### Fechamento de Caixa

Ao final do turno:
1. Clique em "Fechar Caixa"
2. Conte o dinheiro fisicamente
3. Informe o valor encontrado
4. O sistema mostrará a diferença
5. Confirme o fechamento

---

## 🛍️ Compras

### Pedidos de Compra

Gerencie pedidos de compra:
- Número do pedido
- Fornecedor
- Data e previsão de entrega
- Itens e valores
- Status (Rascunho, Confirmado, Parcial, Recebido)

### Novo Pedido

1. Clique em "Novo Pedido"
2. Selecione o fornecedor
3. Informe a loja e previsão de entrega
4. Adicione os itens:
   - Produto
   - Quantidade
   - Custo unitário
5. Salve como rascunho ou confirme

### Recebimento

Ao receber a mercadoria:
1. Localize o pedido
2. Clique em "Conferir"
3. Informe as quantidades recebidas
4. Confirme o recebimento
5. Estoque é atualizado automaticamente

---

## 💵 Financeiro

### Contas a Pagar

Gerencie suas obrigações:
- Fornecedor
- Descrição
- Data de vencimento
- Valor
- Status (Pendente, Pago, Vencido)

### Contas a Receber

Acompanhe seus recebimentos:
- Cliente
- Descrição
- Data de vencimento
- Valor
- Status

### Fluxo de Caixa

Visualize entradas e saídas:
- Gráfico comparativo
- Saldo previsto
- Projeções

### Baixar Título

Para dar baixa em um título:
1. Localize o lançamento
2. Clique em "Baixar"
3. Informe a data de pagamento
4. Confirme

---

## 🧾 Fiscal

### Documentos Fiscais

Veja todos os documentos emitidos:
- NFC-e (Nota fiscal de consumidor)
- NF-e (Nota fiscal eletrônica)
- Status (Autorizado, Cancelado, Pendente)
- Chave de acesso
- Valor

### Configurações Fiscais

- **Certificado Digital** - Status e validade
- **Ambiente** - Produção ou Homologação
- **Séries e Numeração** - Controle de números

### Contingência

Quando a SEFAZ estiver indisponível:
1. O sistema opera automaticamente em contingência
2. Documentos são emitidos normalmente
3. Transmita em até 24 horas
4. Acesse a aba "Contingência" para transmitir

---

## 👥 Clientes

### Cadastro

1. Clique em "Novo Cliente"
2. Preencha os dados:
   - Nome completo
   - CPF/CNPJ
   - Telefone
   - E-mail
   - Endereço

### Listagem

Veja todos os clientes com:
- Total de compras
- Última compra
- Dados de contato

---

## 🚚 Fornecedores

### Cadastro

1. Clique em "Novo Fornecedor"
2. Preencha os dados:
   - Razão social
   - CNPJ/CPF
   - Telefone
   - E-mail
   - Cidade/Estado

### Listagem

Veja todos os fornecedores com:
- Total de compras
- Última compra
- Dados de contato

---

## 🖥️ Monitor PDV

### Status dos Terminais

Visualize em tempo real:
- Nome do terminal
- Loja
- Status (Online, Offline, etc)
- Última sincronização
- Versão do PDV
- Vendas pendentes

### Fila de Sincronização

Acompanhe a sincronização:
- Entidades sendo sincronizadas
- Quantidade de registros
- Status
- Tempo de resposta

---

## 🔄 Sincronização

### Como Funciona

1. PDV opera localmente
2. Vendas são registradas no banco local
3. Quando há internet, envia ao ERP
4. ERP confirma o recebimento
5. PDV marca como sincronizado

### Se a Internet Cair

- PDV continua funcionando normalmente
- Vendas ficam na fila local
- Quando a conexão voltar, envia automaticamente
- Nenhum dado é perdido

### Forçar Sincronização

Se necessário:
1. Acesse "Sincronização"
2. Clique em "Forçar Sincronização"
3. Aguarde o processamento

---

## 📈 Relatórios

### Relatórios Disponíveis

**Vendas**
- Por período
- Por produto
- Por categoria
- Por loja
- Por operador
- Por forma de pagamento

**Estoque**
- Posição de estoque
- Movimentação
- Inventário
- Perdas
- Produtos sem estoque

**Compras**
- Por fornecedor
- Por produto
- Evolução de custos

**Financeiro**
- Contas a pagar
- Contas a receber
- Fluxo de caixa

### Gerar Relatório

1. Selecione a categoria
2. Escolha o relatório
3. Defina o período
4. Clique em "Gerar"
5. Exporte em PDF ou Excel

---

## ⚙️ Configurações

### Empresa

- Dados da empresa (CNPJ, endereço, etc)
- Segmento (mercado, padaria, etc)

### Usuários

- Listar usuários
- Criar novo usuário
- Editar permissões
- Ativar/desativar

### API / PDV

- URL da API
- Intervalo de sincronização
- Timeout
- Tentativas de retry
- Tokens de autenticação

### Notificações

- Estoque baixo
- Vendas pendentes
- PDV offline
- Contas a vencer
- Faturamento diário

### Backup

- Frequência (diário, semanal)
- Retenção (30, 60, 90 dias)
- Backup manual

### Segurança

- Autenticação em 2 fatores
- HTTPS obrigatório
- Rate limiting
- Logs de auditoria
- Isolamento multi-tenant

---

## ❓ Dúvidas Frequentes

### Esqueci minha senha

Entre em contato com o administrador do sistema.

### Produto não aparece no PDV

1. Verifique se o produto está ativo
2. Confirme se está na loja correta
3. Force uma sincronização
4. Reinicie o PDV

### Venda não sincronizou

1. Verifique a conexão com internet
2. Acesse "Monitor PDV"
3. Veja o status do terminal
4. Force a sincronização

### Estoque incorreto

1. Verifique as movimentações
2. Confirme se todas as vendas foram sincronizadas
3. Realize um inventário
4. Ajuste as diferenças

---

## 📞 Suporte

Para dúvidas ou problemas:

- **E-mail**: suporte@erplite.com.br
- **Telefone**: (31) 3333-1234
- **Horário**: Seg a Sex, 8h às 18h

---

**ERP Lite** - Gestão inteligente para seu negócio! 🚀
