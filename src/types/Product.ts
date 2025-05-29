
export interface Product {
  code: string;
  quantity: number;
  description: string;
  unit: string;
  price: number;
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
