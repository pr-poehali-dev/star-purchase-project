
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import OrderTable from "./OrderTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  setFilter: (filter: string) => void;
  updateOrderStatus: (id: number, newStatus: string) => void;
  clearAllOrders: () => void;
}

const OrdersCard: React.FC<OrdersCardProps> = ({ 
  orders, 
  filter, 
  setFilter, 
  updateOrderStatus,
  clearAllOrders
}) => {
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Заказы звёзд Telegram</CardTitle>
          <CardDescription>
            Управление заказами и проверка статусов
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 text-xs ${filter === "all" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setFilter("all")}
            >
              Все
            </button>
            <button 
              className={`px-3 py-1 text-xs ${filter === "Новый" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setFilter("Новый")}
            >
              Новые
            </button>
            <button 
              className={`px-3 py-1 text-xs ${filter === "В обработке" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setFilter("В обработке")}
            >
              В обработке
            </button>
            <button 
              className={`px-3 py-1 text-xs ${filter === "Выполнен" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setFilter("Выполнен")}
            >
              Выполненные
            </button>
            <button 
              className={`px-3 py-1 text-xs ${filter === "Отменён" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setFilter("Отменён")}
            >
              Отменённые
            </button>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1"
            onClick={clearAllOrders}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Очистить</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <OrderTable 
            orders={filteredOrders} 
            updateOrderStatus={updateOrderStatus}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {filter === "all" 
              ? "Нет заказов для отображения" 
              : `Нет заказов со статусом "${filter}"`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
