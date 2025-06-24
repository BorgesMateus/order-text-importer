
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/types/Product';
import type { OrderSummary } from '@/services/orderService';

interface ProductTableProps {
  products: Product[];
  deliveryFee: number;
  total: number;
  summary: OrderSummary;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, deliveryFee, total, summary }) => {
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

  return (
    <div className="overflow-x-auto max-h-[70vh] relative">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#cc0b11]">
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Quantidade
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 bg-white/95 backdrop-blur">
              Produto
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Unidade
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-right bg-white/95 backdrop-blur">
              Preço Unitário (R$)
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-right bg-white/95 backdrop-blur">
              Peso Total (kg)
            </TableHead>
            <TableHead className="font-bold text-[#cc0b11] py-4 text-center bg-white/95 backdrop-blur">
              Código Produto
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow 
              key={`${product.code}-${index}`}
              className="hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-100 group"
            >
              <TableCell className="py-4 text-center">
                <span className="font-semibold text-[#cc0b11] bg-red-50 px-2 py-1 rounded-md">
                  {product.quantity}
                </span>
              </TableCell>
              <TableCell className="py-4 max-w-md">
                <div className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors" title={product.description}>
                  {product.description}
                </div>
              </TableCell>
              <TableCell className="py-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#ffd23e] text-[#cc0b11] shadow-sm">
                  {product.unit}
                </span>
              </TableCell>
              <TableCell className="py-4 text-right font-bold text-gray-800 group-hover:text-[#cc0b11] transition-colors">
                {formatPrice(product.unitPrice || 0)}
              </TableCell>
              <TableCell className="py-4 text-right font-medium text-gray-700">
                {formatWeight(product.totalWeight)}
              </TableCell>
              <TableCell className="py-4 text-center font-medium text-gray-600 group-hover:text-[#cc0b11] transition-colors">
                {product.code}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Resumo de totais conforme especificado */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
            <p className="font-bold text-blue-700">Total em KG:</p>
            <p className="text-lg font-semibold text-blue-600">{formatWeight(summary.totalKg)}kg</p>
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
            <p className="font-bold text-green-700">Total em Pacotes:</p>
            <p className="text-lg font-semibold text-green-600">{summary.totalPackages} pacotes</p>
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-[#cc0b11]">
            <p className="font-bold text-[#cc0b11]">Valor total do pedido:</p>
            <p className="text-lg font-semibold text-[#cc0b11]">{formatPrice(summary.totalValue)}</p>
            {deliveryFee > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                + {formatPrice(deliveryFee)} (frete) = {formatPrice(total)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
