
import type { Product, Customer, ParseResult } from '@/types/Product';

// Simulação de banco de dados de clientes
const mockCustomers: Customer[] = [
  { code: '1001', cpf: '123.456.789-01', name: 'João Silva' },
  { code: '1002', cpf: '987.654.321-02', name: 'Maria Santos' },
  { code: '1003', cpf: '456.789.123-03', name: 'Pedro Oliveira' },
  { code: '2001', cpf: '321.654.987-04', name: 'Ana Costa' },
  { code: '2002', cpf: '789.123.456-05', name: 'Carlos Ferreira' },
];

export const lookupCustomer = async (customerCode: string): Promise<Customer> => {
  console.log('Consultando cliente:', customerCode);
  
  // Simular delay de consulta ao banco
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const customer = mockCustomers.find(c => c.code === customerCode);
  
  if (!customer) {
    throw new Error('Cliente não encontrado');
  }
  
  console.log('Cliente encontrado:', customer);
  return customer;
};

export const parseOrderText = (text: string): ParseResult => {
  console.log('Iniciando parse do texto do pedido...');
  
  const products: Product[] = [];
  const errors: string[] = [];
  const lines = text.split('\n').filter(line => line.trim());

  // Regex para capturar o padrão: quantidade x descrição - unidade - preço - peso - código
  const productRegex = /^(\d+(?:\.\d+)?)x\s+(.+?)\s+-\s+([A-Z]+)\s+-\s+R\$(\d+(?:[,.]\d+)?)\s+-\s+(?:Peso|Piso)\s+total:\s+(\d+(?:[,.]\d+)?)kg\s+-\s+(\d+)$/i;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    console.log(`Processando linha ${lineNumber}: ${line}`);
    
    // Verificar se a linha contém "x " para ser considerada um item
    if (!line.includes('x ')) {
      console.log(`Linha ${lineNumber} ignorada - não contém 'x '`);
      return;
    }

    const match = line.match(productRegex);
    
    if (!match) {
      const error = `Linha ${lineNumber}: Formato inválido - "${line}"`;
      console.log(error);
      errors.push(error);
      return;
    }

    try {
      const [, quantityStr, description, unit, priceStr, weightStr, code] = match;
      
      // Converter valores numéricos
      const quantity = parseFloat(quantityStr.replace(',', '.'));
      const price = parseFloat(priceStr.replace(',', '.'));
      const totalWeight = parseFloat(weightStr.replace(',', '.'));
      
      // Validar se todos os valores são números válidos
      if (isNaN(quantity) || isNaN(price) || isNaN(totalWeight)) {
        const error = `Linha ${lineNumber}: Valores numéricos inválidos`;
        console.log(error);
        errors.push(error);
        return;
      }

      const product: Product = {
        code: code.trim(),
        quantity,
        description: description.trim(),
        unit: unit.trim().toUpperCase(),
        price,
        totalWeight
      };

      console.log(`Produto extraído da linha ${lineNumber}:`, product);
      products.push(product);
      
    } catch (error) {
      const errorMsg = `Linha ${lineNumber}: Erro ao processar dados - ${error}`;
      console.log(errorMsg);
      errors.push(errorMsg);
    }
  });

  console.log(`Parse concluído: ${products.length} produtos válidos, ${errors.length} erros`);
  
  return { products, errors };
};
