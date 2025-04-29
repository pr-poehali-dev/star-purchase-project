import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreVertical, Star, Check, Clock, Ban } from "lucide-react";

interface Order {
  id: number;
  telegramUsername: string;
  starCount: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  date: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Выполнен':
      return 'bg-green-500';
    case 'В обработке':
      return 'bg-blue-500';
    case 'Новый':
      return 'bg-amber-500';
    case 'Отменён':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getPaymentMethodName = (method: string) => {
  switch (method) {
    case 'sbp':
      return 'СБП';
    case 'yukassa':
      return 'ЮKassa';
    case 'card':
      return 'Банковская карта';
    default:
      return method;
  }
};

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    const storedOrders = JSON.parse(localStorage.getItem('telegramStarOrders') || '[]');
    setOrders(storedOrders);
    setIsLoading(false);
  }, []);

  const updateOrderStatus = (id: number, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('telegramStarOrders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              Панель администратора
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              Администратор
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Заказы звёзд Telegram</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Пока нет заказов</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Telegram</TableHead>
                      <TableHead>Кол-во звёзд</TableHead>
                      <TableHead>Способ оплаты</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.toString().slice(-5)}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleString('ru-RU')}</TableCell>
                        <TableCell>@{order.telegramUsername}</TableCell>
                        <TableCell>{order.starCount}</TableCell>
                        <TableCell>{getPaymentMethodName(order.paymentMethod)}</TableCell>
                        <TableCell>{order.totalPrice.toFixed(2)} ₽</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Новый')}>
                                <Star className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Отметить как новый</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'В обработке')}>
                                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Отметить в обработке</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Выполнен')}>
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span>Отметить выполненным</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Отменён')}>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                <span>Отменить заказ</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
