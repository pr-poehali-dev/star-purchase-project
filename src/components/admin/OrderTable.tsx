import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: number;
  telegramUsername: string;
  starCount: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  date: string;
}

interface OrderTableProps {
  orders: Order[];
  updateOrderStatus: (id: number, newStatus: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, updateOrderStatus }) => {
  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'sbp': return 'СБП';
      case 'yukassa': return 'ЮKassa';
      case 'card': return 'Банковская карта';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Пока нет заказов</h3>
        <p className="text-muted-foreground">Заказы будут появляться здесь после оформления</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Звёзды</TableHead>
            <TableHead>Метод оплаты</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">#{order.id.toString().slice(-6)}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>@{order.telegramUsername}</TableCell>
              <TableCell>{order.starCount} ✨</TableCell>
              <TableCell>{getPaymentMethodName(order.paymentMethod)}</TableCell>
              <TableCell>{order.totalPrice.toFixed(2)} ₽</TableCell>
              <TableCell><OrderStatusBadge status={order.status} /></TableCell>
              <TableCell>
                <Select 
                  value={order.status} 
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Изменить" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Новый">Новый</SelectItem>
                    <SelectItem value="В обработке">В обработке</SelectItem>
                    <SelectItem value="Выполнен">Выполнен</SelectItem>
                    <SelectItem value="Отменён">Отменён</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
