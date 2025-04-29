import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'Новый':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Новый</Badge>;
    case 'В обработке':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">В обработке</Badge>;
    case 'Выполнен':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Выполнен</Badge>;
    case 'Отменён':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Отменён</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default OrderStatusBadge;
