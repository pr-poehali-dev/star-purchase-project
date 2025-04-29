import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PriceCalculatorProps {
  starCount: number;
  pricePerStar: number;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  starCount,
  pricePerStar,
}) => {
  const totalPrice = (starCount * pricePerStar).toFixed(2);
  
  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Количество звёзд</span>
          <span className="font-medium">{starCount} шт.</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Стоимость за 1 звезду</span>
          <span className="font-medium">{pricePerStar.toFixed(2)} ₽</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Итого к оплате</span>
          <span className="text-xl font-bold text-primary">{totalPrice} ₽</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
