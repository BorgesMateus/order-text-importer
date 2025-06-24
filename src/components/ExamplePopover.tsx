
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExamplePopover: React.FC = () => {
  const exampleText = `Novo Pedido
Produtos:
• 6x SALG FESTA COXINHA C/ REQUEIJAO PCT 50 UNID - PC - R$18.3 - Peso total: 5.10kg (6 pacotes * 0.85kg/pacote) - 20001
• 6x SALG FESTA KIBE C/ CATUPIRY PCT 50 UNID - PC - R$18.3 - Peso total: 5.10kg (6 pacotes * 0.85kg/pacote) - 20007
• 3x SALG FESTA CROQUETE DE QUEIJO PCT 50 UNID - PC - R$18.3 - Peso total: 2.55kg (3 pacotes * 0.85kg/pacote) - 20035
• 2x PAO DE QUEIJO GG 15G PCT 1KG - KG - R$18.4 - Peso total: 2.00kg (2 pacotes * 1.0kg/pacote) - 10034

Taxa de entrega: R$15.00
Total: R$125.10`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-[#cc0b11] hover:bg-gray-100"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-[#cc0b11]">Exemplo de Formato</h4>
          <p className="text-sm text-gray-600">
            O texto deve seguir o padrão abaixo:
          </p>
          <div className="bg-gray-50 p-3 rounded-lg border text-sm">
            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800">
              {exampleText}
            </pre>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Formato do produto:</strong> • {'{quantidade}'}x {'{descrição}'} - {'{unidade}'} - R${'{preço}'} - Peso total: {'{peso}'}kg - {'{código}'}</p>
            <p><strong>Taxa de entrega:</strong> Taxa de entrega: R${'{valor}'}</p>
            <p><strong>Nota:</strong> Cada produto deve começar com • (bullet point)</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExamplePopover;
