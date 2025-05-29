
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Import, FileText, User } from 'lucide-react';
import ProductTable from '@/components/ProductTable';
import { parseOrderText, lookupCustomer } from '@/services/orderService';
import type { Product } from '@/types/Product';

const Index = () => {
  const [customerCode, setCustomerCode] = useState('');
  const [customerCPF, setCustomerCPF] = useState('');
  const [orderText, setOrderText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
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
      
      // Consultar CPF do cliente
      const customer = await lookupCustomer(customerCode);
      setCustomerCPF(customer.cpf);

      // Processar texto do pedido
      const result = parseOrderText(orderText);
      setProducts(result.products);
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

    } catch (error) {
      console.error('Erro ao importar pedido:', error);
      setCustomerCPF('Cliente inexistente');
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

  const exampleText = `3x SALG FESTA COXINHA C/ REQUEIJAO PCT 50 UNID - PC - R$54.90 - Piso total: 2.55kg - 20001
1x PAO DE QUEIJO PREMIUM 30G PCT 5KG - KG - R$114.95 - Peso total: 5.00kg - 50659`;

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

        {/* Formulário de Importação */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-[#cc0b11] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Import className="h-5 w-5" />
                Dados do Cliente e Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Código do Cliente */}
              <div className="space-y-2">
                <Label htmlFor="customerCode" className="text-sm font-medium text-gray-700">
                  Código do Cliente *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerCode"
                    placeholder="Digite o código do cliente"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#cc0b11] focus:ring-[#cc0b11]"
                  />
                </div>
              </div>

              {/* CPF do Cliente */}
              <div className="space-y-2">
                <Label htmlFor="customerCPF" className="text-sm font-medium text-gray-700">
                  CPF do Cliente
                </Label>
                <Input
                  id="customerCPF"
                  placeholder="CPF será preenchido automaticamente"
                  value={customerCPF}
                  readOnly
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              {/* Texto do Pedido */}
              <div className="space-y-2">
                <Label htmlFor="orderText" className="text-sm font-medium text-gray-700">
                  Texto do Pedido *
                </Label>
                <Textarea
                  id="orderText"
                  placeholder="Cole aqui o texto do pedido..."
                  value={orderText}
                  onChange={(e) => setOrderText(e.target.value)}
                  className="min-h-[120px] border-gray-300 focus:border-[#cc0b11] focus:ring-[#cc0b11]"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleImportOrder}
                  disabled={isLoading}
                  className="flex-1 bg-[#cc0b11] hover:bg-[#a00912] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Import className="h-4 w-4 mr-2" />
                  {isLoading ? 'Importando...' : 'Importar Pedido'}
                </Button>
                
                <Button
                  onClick={handleGenerateOrder}
                  variant="outline"
                  className="flex-1 border-[#ffd23e] text-[#cc0b11] hover:bg-[#ffd23e] hover:text-[#cc0b11] font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Pedido
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exemplo de Formato */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-[#ffd23e] text-[#cc0b11] rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exemplo de Formato
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-3">
                O texto deve seguir o padrão abaixo (uma linha por produto):
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <code className="text-sm text-gray-800 whitespace-pre-line">
                  {exampleText}
                </code>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p><strong>Formato:</strong> {'{quantidade}'}x {'{descrição}'} - {'{unidade}'} - R${'{preço}'} - Peso total: {'{peso}'}kg - {'{código}'}</p>
                <p className="mt-1"><strong>Nota:</strong> Aceita "Peso total:" ou "Piso total:"</p>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Tabela de Produtos */}
        {products.length > 0 && (
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-[#cc0b11] text-white rounded-t-lg">
              <CardTitle>
                Produtos Importados ({products.length} itens)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ProductTable products={products} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
