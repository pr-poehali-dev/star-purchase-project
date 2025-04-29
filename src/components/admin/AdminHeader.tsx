import React from "react";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import Header from "@/components/Header";

const AdminHeader: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
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
      </div>
    </>
  );
};

export default AdminHeader;
