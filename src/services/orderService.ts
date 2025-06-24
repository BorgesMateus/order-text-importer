
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

export interface OrderSummary {
  totalKg: number;
  totalPackages: number;
  totalValue: number;
}

export const parseOrderText = (text: string): ParseResult & { deliveryFee: number; total: number; summary: OrderSummary } => {
  console.log('Iniciando parse do texto do pedido...');
  
  const products: Product[] = [];
  const errors: string[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  let deliveryFee = 0;

  // Regex para capturar: quantidade x produto - unidade - preço - peso total - código
  const productRegex = /^(\d+(?:\.\d+)?)x\s+(.+?)\s+-\s+(PC|KG)\s+-\s+R\$(\d+(?:[,.]\d+)?)\s+-\s+Peso\s+total:\s+(\d+(?:[,.]\d+)?)kg\s+-\s+(\d+)$/i;
  
  // Regex para capturar taxa de entrega
  const deliveryFeeRegex = /Taxa\s+de\s+entrega:\s+R\$(\d+(?:[,.]\d+)?)/i;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    console.log(`Processando linha ${lineNumber}: ${line}`);
    
    // Verificar se é taxa de entrega
    const deliveryMatch = line.match(deliveryFeeRegex);
    if (deliveryMatch) {
      deliveryFee = parseFloat(deliveryMatch[1].replace(',', '.'));
      console.log(`Taxa de entrega encontrada: R$${deliveryFee}`);
      return;
    }
    
    // Verificar se a linha contém padrão de produto (quantidade x produto)
    if (!/^\d+(?:\.\d+)?x\s+/.test(line.trim())) {
      console.log(`Linha ${lineNumber} ignorada - não é um produto`);
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
      const unitPrice = parseFloat(priceStr.replace(',', '.'));
      const totalWeight = parseFloat(weightStr.replace(',', '.'));
      
      // Validar se todos os valores são números válidos
      if (isNaN(quantity) || isNaN(unitPrice) || isNaN(totalWeight)) {
        const error = `Linha ${lineNumber}: Valores numéricos inválidos`;
        console.log(error);
        errors.push(error);
        return;
      }

      // Calcular preço total do item (quantidade * preço unitário)
      const totalPrice = quantity * unitPrice;

      const product: Product = {
        code: code.trim(),
        quantity,
        description: description.trim(),
        unit: unit.trim().toUpperCase(),
        price: totalPrice, // Agora é o total do item (quantidade * preço unitário)
        unitPrice, // Novo campo para preço unitário
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

  // Calcular totais conforme as regras
  let totalKg = 0;
  let totalPackages = 0;
  let totalValue = 0;

  products.forEach(product => {
    if (product.unit === 'KG') {
      totalKg += product.totalWeight; // Para KG, somar o peso total
    } else if (product.unit === 'PC') {
      totalPackages += product.quantity; // Para PC, somar a quantidade de pacotes
    }
    totalValue += product.price; // Somar o valor total de cada item
  });

  const summary: OrderSummary = {
    totalKg,
    totalPackages,
    totalValue
  };

  const total = totalValue + deliveryFee;

  console.log(`Parse concluído: ${products.length} produtos válidos, ${errors.length} erros`);
  console.log(`Total KG: ${totalKg}kg, Total Pacotes: ${totalPackages}, Valor produtos: R$${totalValue.toFixed(2)}, Taxa: R$${deliveryFee.toFixed(2)}, Total: R$${total.toFixed(2)}`);
  
  return { products, errors, deliveryFee, total, summary };
};
