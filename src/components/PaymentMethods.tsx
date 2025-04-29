import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Способ оплаты</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground cursor-pointer">
                <Info className="h-4 w-4 mr-1" />
                <span>Информация о получателе</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Оплата производится на реквизиты ИП Иванов И.И. (ОГРНИП: 123456789012345). Все платежи защищены.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="grid gap-4">
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="sbp" id="sbp" />
          <Label htmlFor="sbp" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">СБП</div>
              <div className="text-xs text-muted-foreground">Быстрый перевод по номеру телефона +7 (988) 311-56-45</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="yukassa" id="yukassa" />
          <Label htmlFor="yukassa" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z" />
                <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" fill="white" />
              </svg>
            </div>
            <div>
              <div className="font-medium">ЮKassa</div>
              <div className="text-xs text-muted-foreground">Безопасная оплата через платёжный шлюз</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-purple-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">Банковская карта</div>
              <div className="text-xs text-muted-foreground">Visa, MasterCard, МИР</div>
            </div>
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-700">
        <p>Все платежи обрабатываются через официальные платёжные системы и поступают на счёт ИП Иванов И.И. После оплаты вы получите чек в соответствии с ФЗ-54.</p>
      </div>
    </div>
  );
};

export default PaymentMethods;
