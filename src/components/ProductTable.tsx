
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/types/Product';

interface ProductTableProps {
  products: Product[];
  deliveryFee: number;
  total: number;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, deliveryFee, total }) => {
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
    <div className="overflow-x-auto max-h-[70vh] relative">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#cc0b11]">
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Código
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Quantidade*
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 bg-white/95 backdrop-blur">
              Descrição
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Unidade
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-right bg-white/95 backdrop-blur">
              Preço
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-right bg-white/95 backdrop-blur">
              Peso Total (kg)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow 
              key={`${product.code}-${index}`}
              className="hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 group"
            >
              <TableCell className="font-medium py-4 text-center group-hover:text-[#cc0b11] transition-colors">
                {product.code}
              </TableCell>
              <TableCell className="py-4 text-center">
                <span className="font-semibold text-[#cc0b11] bg-red-50 px-2 py-1 rounded-md">
                  {getDisplayQuantity(product)}
                </span>
              </TableCell>
              <TableCell className="py-4 max-w-md">
                <div className="truncate font-medium text-gray-800 group-hover:text-gray-900 transition-colors" title={product.description}>
                  {product.description}
                </div>
              </TableCell>
              <TableCell className="py-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#ffd23e] text-[#cc0b11] shadow-sm">
                  {product.unit}
                </span>
              </TableCell>
              <TableCell className="py-4 text-right font-bold text-gray-800 group-hover:text-[#cc0b11] transition-colors">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell className="py-4 text-right font-medium text-gray-700">
                {formatWeight(product.totalWeight)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Nota explicativa com design melhorado */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong className="text-[#cc0b11]">* Observação:</strong> Se "Unidade" for KG, "Quantidade" mostra o valor do peso. 
          Se "Unidade" for diferente de KG (ex: "PC"), "Quantidade" mostra o valor da quantidade.
        </p>
      </div>
    </div>
  );
};

export default ProductTable;
