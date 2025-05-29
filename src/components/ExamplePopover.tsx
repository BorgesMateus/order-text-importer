
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExamplePopover: React.FC = () => {
  const exampleText = `Produtos:
1x SALG FESTA RISOLE BOLIVIANO PCT 50 UNID (Pacote 50un) - R$18.30 - Peso total: 0.85kg - 20034
1x BROA DOCE 35G PCT 1KG (Pacote 1kg) - R$16.90 - Peso total: 1.00kg - 50615
1x PAO DE LEITE 50G PCT 3,5K (Pacote) - R$35.35 - Peso total: 3.50kg - 81
1x PAO MANDI 70G PCT 3,5K (Pacote) - R$39.55 - Peso total: 3.50kg - 80

Entrega para: Parkway
Taxa de entrega: R$15.00
Forma de pagamento: Pix

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
            <p><strong>Formato do produto:</strong> {'{quantidade}'}x {'{descrição}'} - R${'{preço}'} - Peso total: {'{peso}'}kg - {'{código}'}</p>
            <p><strong>Taxa de entrega:</strong> Taxa de entrega: R${'{valor}'}</p>
            <p><strong>Nota:</strong> Aceita "Peso total:" ou "Piso total:"</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExamplePopover;
