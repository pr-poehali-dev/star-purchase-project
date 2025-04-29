import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, DollarSign, Users, Clock } from "lucide-react";
import Header from "@/components/Header";

interface Order {
  id: number;
  telegramUsername: string;
  starCount: number;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  date: string;
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  // Статистика
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('telegramStarOrders') || '[]') as Order[];
    setOrders(savedOrders);
    
    // Подсчет статистики
    const totalRevenue = savedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const pendingOrders = savedOrders.filter(order => order.status === 'Новый' || order.status === 'В обработке').length;
    const completedOrders = savedOrders.filter(order => order.status === 'Выполнен').length;
    
    setStats({
      totalOrders: savedOrders.length,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  }, []);

  const updateOrderStatus = (id: number, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('telegramStarOrders', JSON.stringify(updatedOrders));
    
    // Обновление статистики
    const pendingOrders = updatedOrders.filter(order => order.status === 'Новый' || order.status === 'В обработке').length;
    const completedOrders = updatedOrders.filter(order => order.status === 'Выполнен').length;
    
    setStats({
      ...stats,
      pendingOrders,
      completedOrders
    });
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'sbp': return 'СБП';
      case 'yukassa': return 'ЮKassa';
      case 'card': return 'Банковская карта';
      default: return method;
    }
  };
  
  const getStatusBadge = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">Управление заказами звёзд Telegram</p>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground mr-2">Платёжные реквизиты:</p>
            <Badge variant="outline" className="bg-green-50 border-green-200">
              <DollarSign className="w-3 h-3 mr-1 text-green-600" /> 
              ИП Иванов И.И.
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalOrders}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Выручка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} ₽</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ожидают обработки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{stats.pendingOrders}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Выполнено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.completedOrders}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
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
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Пока нет заказов</h3>
                <p className="text-muted-foreground">Заказы будут появляться здесь после оформления</p>
              </div>
            ) : (
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
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">#{order.id.toString().slice(-6)}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>@{order.telegramUsername}</TableCell>
                        <TableCell>{order.starCount} ✨</TableCell>
                        <TableCell>{getPaymentMethodName(order.paymentMethod)}</TableCell>
                        <TableCell>{order.totalPrice.toFixed(2)} ₽</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
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
            )}
          </CardContent>
        </Card>
        
        <Separator className="mb-4" />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Платёжные реквизиты для получения средств:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>ИП Иванов Иван Иванович</li>
            <li>ИНН: 123456789012</li>
            <li>ОГРНИП: 123456789012345</li>
            <li>Р/с: 40802810123456789012 в ПАО Сбербанк</li>
            <li>БИК: 044525225</li>
            <li>К/с: 30101810400000000225</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Admin;
