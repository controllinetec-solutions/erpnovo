/**
 * Exportação de Relatórios - PDF e Excel
 * 
 * Utilitários para exportar dados em formato PDF e Excel
 */

// ============================================
// EXPORTAÇÃO PARA CSV/EXCEL
// ============================================

export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  if (!data || data.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  // Se não houver headers, usa as chaves do primeiro objeto
  const keys = headers || Object.keys(data[0]);
  
  // Criar linha de cabeçalho
  const csvHeaders = keys.map(key => {
    // Converter camelCase para Título
    const header = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return `"${header}"`;
  }).join(',');

  // Criar linhas de dados
  const csvRows = data.map(row => {
    return keys.map(key => {
      let value = row[key];
      
      // Formatar valores
      if (value === null || value === undefined) {
        return '""';
      }
      
      if (typeof value === 'string') {
        // Escapar aspas duplas
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      }
      
      if (typeof value === 'number') {
        return value;
      }
      
      if (value instanceof Date) {
        return `"${value.toLocaleString('pt-BR')}"`;
      }
      
      return `"${String(value)}"`;
    }).join(',');
  });

  // Combinar tudo
  const csvContent = [csvHeaders, ...csvRows].join('\n');

  // Adicionar BOM para UTF-8 (Excel)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Download
  downloadBlob(blob, `${filename}.csv`);
}

export function exportToExcel(data: any[], filename: string, headers?: string[]) {
  // Para Excel, usamos CSV com extensão .xls (compatível com Excel)
  // Para Excel nativo (.xlsx), seria necessário uma biblioteca como SheetJS
  exportToCSV(data, filename, headers);
}

// ============================================
// EXPORTAÇÃO PARA PDF
// ============================================

export function exportToPDF(data: any[], filename: string, title: string) {
  if (!data || data.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  // Criar HTML para impressão
  const html = generatePDFHTML(data, title);
  
  // Abrir nova janela
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up bloqueado. Permita pop-ups para exportar PDF.');
    return;
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Aguardar carregamento e imprimir
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function generatePDFHTML(data: any[], title: string): string {
  const keys = Object.keys(data[0]);
  const date = new Date().toLocaleString('pt-BR');
  
  const headers = keys.map(key => {
    const header = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return `<th>${header}</th>`;
  }).join('');
  
  const rows = data.map(row => {
    const cells = keys.map(key => {
      let value = row[key];
      
      if (value === null || value === undefined) {
        return '<td>-</td>';
      }
      
      if (typeof value === 'number') {
        return `<td>${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>`;
      }
      
      if (value instanceof Date) {
        return `<td>${value.toLocaleString('pt-BR')}</td>`;
      }
      
      return `<td>${String(value)}</td>`;
    }).join('');
    
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 15px;
    }
    .header h1 {
      color: #10b981;
      font-size: 24px;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 11px;
    }
    th {
      background-color: #10b981;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    tr:hover {
      background-color: #f3f4f6;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      color: #999;
      border-top: 1px solid #e5e7eb;
      padding-top: 15px;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 20px;">
    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
      🖨️ Imprimir / Salvar PDF
    </button>
    <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;">
      ✕ Fechar
    </button>
  </div>
  
  <div class="header">
    <h1>${title}</h1>
    <p>Gerado em: ${date}</p>
    <p>Total de registros: ${data.length}</p>
  </div>
  
  <table>
    <thead>
      <tr>${headers}</tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  
  <div class="footer">
    <p>ERP Lite - Sistema de Gestão para Varejo Alimentar</p>
    <p>Documento gerado automaticamente em ${date}</p>
  </div>
</body>
</html>
  `;
}

// ============================================
// UTILITÁRIOS
// ============================================

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ============================================
// FUNÇÕES ESPECÍFICAS PARA RELATÓRIOS
// ============================================

export function exportProductsReport(products: any[]) {
  const formattedProducts = products.map(p => ({
    Código: p.code,
    'Código de Barras': p.barcode,
    Descrição: p.description,
    Categoria: p.category,
    Marca: p.brand,
    'Preço Custo': p.costPrice,
    'Preço Venda': p.salePrice,
    'Margem %': p.margin,
    Estoque: p.currentStock,
    'Estoque Mínimo': p.minStock,
    Status: p.status === 'active' ? 'Ativo' : 'Inativo',
  }));
  
  exportToCSV(formattedProducts, 'relatorio_produtos');
}

export function exportSalesReport(sales: any[]) {
  const formattedSales = sales.map(s => ({
    'ID Venda': s.saleId,
    Data: new Date(s.date).toLocaleString('pt-BR'),
    Operador: s.operator,
    PDV: s.terminalId,
    Loja: s.storeId,
    Cliente: s.customer,
    Itens: s.items,
    'Forma Pagamento': s.paymentType,
    Total: s.total,
    Status: s.status === 'completed' ? 'Concluída' : 'Cancelada',
  }));
  
  exportToCSV(formattedSales, 'relatorio_vendas');
}

export function exportFinancialReport(entries: any[]) {
  const formattedEntries = entries.map(e => ({
    Tipo: e.type === 'payable' ? 'Conta a Pagar' : 'Conta a Receber',
    Descrição: e.description,
    Entidade: e.entity,
    Vencimento: new Date(e.dueDate).toLocaleDateString('pt-BR'),
    Valor: e.value,
    Status: e.status === 'paid' ? 'Pago' : e.status === 'overdue' ? 'Vencido' : 'Pendente',
  }));
  
  exportToCSV(formattedEntries, 'relatorio_financeiro');
}

export function exportStockReport(stock: any[]) {
  const formattedStock = stock.map(s => ({
    Produto: s.productName,
    'Código de Barras': s.barcode,
    Loja: s.store,
    'Estoque Atual': s.currentStock,
    'Estoque Mínimo': s.minStock,
    'Valor Unitário': s.costPrice,
    'Valor Total': s.currentStock * s.costPrice,
    Status: s.currentStock === 0 ? 'Sem Estoque' : s.currentStock <= s.minStock ? 'Baixo' : 'Normal',
  }));
  
  exportToCSV(formattedStock, 'relatorio_estoque');
}
