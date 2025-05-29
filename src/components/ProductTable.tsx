
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/types/Product';

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatWeight = (weight: number) => {
    return weight.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const getDisplayQuantity = (product: Product) => {
    // Se a unidade for KG, mostrar o peso total
    if (product.unit.toLowerCase() === 'kg') {
      return formatWeight(product.totalWeight);
    }
    // Caso contrário, mostrar a quantidade
    return product.quantity.toString();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4">
              Código
            </TableHead>
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4">
              Quantidade*
            </TableHead>
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4">
              Descrição
            </TableHead>
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4">
              Unidade
            </TableHead>
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4 text-right">
              Preço
            </TableHead>
            <TableHead className="font-semibold text-[#cc0b11] border-b-2 border-[#cc0b11] py-4 text-right">
              Peso Total (kg)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow 
              key={`${product.code}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium py-4">
                {product.code}
              </TableCell>
              <TableCell className="py-4">
                <span className="font-medium text-[#cc0b11]">
                  {getDisplayQuantity(product)}
                </span>
              </TableCell>
              <TableCell className="py-4 max-w-md">
                <div className="truncate" title={product.description}>
                  {product.description}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ffd23e] text-[#cc0b11]">
                  {product.unit}
                </span>
              </TableCell>
              <TableCell className="py-4 text-right font-medium">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell className="py-4 text-right">
                {formatWeight(product.totalWeight)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Nota explicativa */}
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-xs text-gray-600">
          <strong>* Observação:</strong> Se "Unidade" for KG, "Quantidade" mostra o valor do peso. 
          Se "Unidade" for diferente de KG (ex: "PC"), "Quantidade" mostra o valor da quantidade.
        </p>
      </div>
    </div>
  );
};

export default ProductTable;
