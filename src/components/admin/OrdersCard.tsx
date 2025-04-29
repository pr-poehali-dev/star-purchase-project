import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderTable from "./OrderTable";

interface Order {
  id: number;
  telegramUsername: string;
  starCount: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  date: string;
}

interface OrdersCardProps {
  orders: Order[];
  filter: string;
  setFilter: (value: string) => void;
  updateOrderStatus: (id: number, newStatus: string) => void;
}

const OrdersCard: React.FC<OrdersCardProps> = ({ 
  orders, 
  filter, 
  setFilter, 
  updateOrderStatus 
}) => {
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Заказы</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все заказы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="Новый">Новые</SelectItem>
              <SelectItem value="В обработке">В обработке</SelectItem>
              <SelectItem value="Выполнен">Выполненные</SelectItem>
              <SelectItem value="Отменён">Отменённые</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Управление заказами и выплатами
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTable 
          orders={filteredOrders} 
          updateOrderStatus={updateOrderStatus} 
        />
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
