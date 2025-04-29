import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

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
      <h3 className="text-lg font-medium">Способ оплаты</h3>
      
      <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="grid gap-4">
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="sbp" id="sbp" />
          <Label htmlFor="sbp" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="font-medium">СБП</div>
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
            <div className="font-medium">ЮKassa</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-purple-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div className="font-medium">Банковская карта</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethods;
