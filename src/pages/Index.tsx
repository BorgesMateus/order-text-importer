
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, User } from 'lucide-react';
import ProductTable from '@/components/ProductTable';
import ExamplePopover from '@/components/ExamplePopover';
import { parseOrderText, lookupCustomer } from '@/services/orderService';
import type { Product } from '@/types/Product';

const Index = () => {
  const [customerCode, setCustomerCode] = useState('');
  const [customerCPF, setCustomerCPF] = useState('');
  const [observacaoNF, setObservacaoNF] = useState('');
  const [orderText, setOrderText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImportOrder = async () => {
    if (!customerCode.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o código do cliente.",
        variant: "destructive"
      });
      return;
    }

    if (!orderText.trim()) {
      toast({
        title: "Erro", 
        description: "Por favor, cole o texto do pedido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      console.log('Iniciando importação do pedido...');
      
      // Primeiro, processar o texto do pedido
      const result = parseOrderText(orderText);
      setProducts(result.products);
      setDeliveryFee(result.deliveryFee);
      setTotal(result.total);
      setErrors(result.errors);

      if (result.products.length === 0) {
        toast({
          title: "Atenção",
          description: "Nenhum item válido encontrado no pedido.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${result.products.length} itens importados com sucesso.`,
        });
      }

      if (result.errors.length > 0) {
        console.log('Erros encontrados:', result.errors);
      }

      // Depois, consultar CPF do cliente (independente dos produtos)
      try {
        const customer = await lookupCustomer(customerCode);
        setCustomerCPF(customer.cpf);
      } catch (customerError) {
        console.log('Cliente não encontrado:', customerError);
        setCustomerCPF('Cliente inexistente');
      }

    } catch (error) {
      console.error('Erro ao importar pedido:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar pedido.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOrder = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O botão 'Gerar pedido' será implementado em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Importação de Pedidos
          </h1>
          <p className="text-gray-600">
            Importe pedidos em formato texto e visualize os produtos em tabela organizada
          </p>
        </div>

        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Coluna 1 - Formulário (40% = 2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Importação */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-[#cc0b11] text-white rounded-t-lg pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Dados do Cliente e Pedido
                  </div>
                  <ExamplePopover />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Código do Cliente */}
                <div className="space-y-1">
                  <Label htmlFor="customerCode" className="text-sm font-medium text-gray-700">
                    Código do Cliente *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerCode"
                      placeholder="Digite o código do cliente"
                      value={customerCode}
                      onChange={(e) => setCustomerCode(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#cc0b11] focus:ring-[#cc0b11] h-9"
                    />
                  </div>
                </div>

                {/* CPF do Cliente */}
                <div className="space-y-1">
                  <Label htmlFor="customerCPF" className="text-sm font-medium text-gray-700">
                    CPF do Cliente
                  </Label>
                  <Input
                    id="customerCPF"
                    placeholder="CPF será preenchido automaticamente"
                    value={customerCPF}
                    readOnly
                    className="bg-gray-50 border-gray-300 h-9"
                  />
                </div>

                {/* Observação da NF */}
                <div className="space-y-1">
                  <Label htmlFor="observacaoNF" className="text-sm font-medium text-gray-700">
                    Observação da NF
                  </Label>
                  <Textarea
                    id="observacaoNF"
                    placeholder="Digite observações para a Nota Fiscal..."
                    value={observacaoNF}
                    onChange={(e) => setObservacaoNF(e.target.value)}
                    className="min-h-[60px] border-gray-300 focus:border-[#cc0b11] focus:ring-[#cc0b11] resize-none"
                  />
                </div>

                {/* Texto do Pedido */}
                <div className="space-y-1">
                  <Label htmlFor="orderText" className="text-sm font-medium text-gray-700">
                    Texto do Pedido *
                  </Label>
                  <Textarea
                    id="orderText"
                    placeholder="Cole aqui o texto do pedido..."
                    value={orderText}
                    onChange={(e) => setOrderText(e.target.value)}
                    className="min-h-[100px] border-gray-300 focus:border-[#cc0b11] focus:ring-[#cc0b11]"
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-3">
                  <Button
                    onClick={handleImportOrder}
                    disabled={isLoading}
                    className="flex-1 bg-[#cc0b11] hover:bg-[#a00912] text-white font-medium h-8 px-3 rounded-lg transition-colors text-sm"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {isLoading ? 'Importando...' : 'Importar Pedido'}
                  </Button>
                  
                  <Button
                    onClick={handleGenerateOrder}
                    variant="outline"
                    className="flex-1 border-[#ffd23e] text-[#cc0b11] hover:bg-[#ffd23e] hover:text-[#cc0b11] font-medium h-8 px-3 rounded-lg transition-colors text-sm"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Gerar Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Erros */}
            {errors.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription>
                  <strong>Linhas com problemas encontradas:</strong>
                  <ul className="mt-2 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm">• {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Coluna 2 - Tabela de Produtos (60% = 3/5) */}
          <div className="lg:col-span-3">
            {products.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-[#cc0b11] text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <span>Produtos Importados ({products.length} itens)</span>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        Total: R$ {total.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ProductTable 
                    products={products} 
                    deliveryFee={deliveryFee}
                    total={total}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
