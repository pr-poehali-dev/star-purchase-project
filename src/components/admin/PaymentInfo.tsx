import React from "react";
import { Separator } from "@/components/ui/separator";

const PaymentInfo: React.FC = () => {
  return (
    <>
      <Separator className="mb-4" />
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Платёжные реквизиты для получения средств:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>ИП Иванов Иван Иванович</li>
          <li>ИНН: 123456789012</li>
          <li>ОГРНИП: 123456789012345</li>
          <li>Телефон СБП: +7 (988) 311-56-45</li>
          <li>Р/с: 40802810123456789012 в ПАО Сбербанк</li>
          <li>БИК: 044525225</li>
          <li>К/с: 30101810400000000225</li>
        </ul>
      </div>
    </>
  );
};

export default PaymentInfo;
