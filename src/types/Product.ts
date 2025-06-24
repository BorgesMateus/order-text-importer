
export interface Product {
  code: string;
  quantity: number;
  description: string;
  unit: string;
  price: number; // Preço total do item (quantidade * preço unitário)
  unitPrice?: number; // Preço unitário
  totalWeight: number;
}

export interface Customer {
  code: string;
  cpf: string;
  name?: string;
}

export interface ParseResult {
  products: Product[];
  errors: string[];
}
