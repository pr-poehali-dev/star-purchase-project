
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Send, AlertCircle, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface Message {
  id: string;
  from: 'user' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
  senderName?: string;
}

const Support: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || '';
    
    setIsAuthenticated(loggedIn);
    setUserEmail(email);
    setUserName(name);
    
    if (loggedIn) {
      loadMessages(email);
    }
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = (email: string) => {
    const chatKey = `support_chat_${email}`;
    const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]') as Message[];
    
    // Сортируем сообщения по времени
    savedMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setMessages(savedMessages);
    
    // Отмечаем сообщения админа как прочитанные
    if (savedMessages.some(msg => msg.from === 'admin' && !msg.read)) {
      const updatedMessages = savedMessages.map(msg => 
        msg.from === 'admin' && !msg.read ? {...msg, read: true} : msg
      );
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isAuthenticated) return;

    const message: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      senderName: userName || userEmail
    };

    const chatKey = `support_chat_${userEmail}`;
    const updatedMessages = [...messages, message];
    
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setNewMessage("");
    
    // Обновляем список поддержки для админов
    updateSupportList(userEmail, userName || userEmail);
    
    // Увеличиваем счетчик непрочитанных сообщений для админов
    updateUnreadCount();

    toast({
      title: "Сообщение отправлено",
      description: "Служба поддержки ответит вам в ближайшее время",
    });
  };

  const updateSupportList = (email: string, name: string) => {
    // Получаем текущий список пользователей
    let supportUsers = JSON.parse(localStorage.getItem('support_users') || '[]');
    
    // Проверяем, есть ли пользователь в списке
    const userExists = supportUsers.some((user: any) => 
      typeof user === 'object' ? user.email === email : user === email
    );

    // Если пользователь уже существует как строка, заменяем его на объект
    supportUsers = supportUsers.map((user: any) => {
      if (typeof user === 'string' && user === email) {
        return { email, name, lastActive: new Date().toISOString() };
      }
      return user;
    });
    
    // Если пользователя нет в списке, добавляем его
    if (!userExists) {
      supportUsers.push({ 
        email, 
        name, 
        lastActive: new Date().toISOString() 
      });
    } else {
      // Обновляем время последней активности
      supportUsers = supportUsers.map((user: any) => {
        if (typeof user === 'object' && user.email === email) {
          return { ...user, lastActive: new Date().toISOString() };
        }
        return user;
      });
    }
    
    localStorage.setItem('support_users', JSON.stringify(supportUsers));
  };

  const updateUnreadCount = () => {
    // Увеличиваем счетчик непрочитанных сообщений
    const adminUnreadCount = parseInt(localStorage.getItem('admin_unread_support_count') || '0');
    localStorage.setItem('admin_unread_support_count', (adminUnreadCount + 1).toString());
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ru 
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <Header />
        <main className="container-1920 mx-auto px-4 py-8 md:py-12">
          <div className="content-container max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Служба поддержки</CardTitle>
                <CardDescription>
                  Чтобы связаться с поддержкой, необходимо войти в аккаунт
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Требуется авторизация</p>
                    <p className="text-sm">Для обращения в поддержку необходимо <a href="/login" className="underline font-medium">войти в аккаунт</a></p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Войти в аккаунт
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <main className="container-1920 mx-auto px-4 py-8 md:py-12">
        <div className="content-container max-w-2xl mx-auto">
          <Card className="min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Служба поддержки
              </CardTitle>
              <CardDescription>
                Если у вас возникли вопросы, напишите нам, и мы ответим в ближайшее время
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-[400px] p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
                    <p>У вас пока нет сообщений</p>
                    <p className="text-sm">Напишите, если вам нужна помощь</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.from === 'admin' && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>АД</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.from === 'user' 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-secondary rounded-tl-none'
                          }`}
                        >
                          <div className="text-sm">{message.text}</div>
                          <div className="text-xs mt-1 opacity-70 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                        
                        {message.from === 'user' && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarFallback>{getInitials(userName || userEmail)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-4 border-t">
              <div className="flex items-center w-full space-x-2">
                <Textarea
                  placeholder="Введите ваше сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-grow resize-none"
                  rows={3}
                />
                <Button 
                  className="h-full" 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Отправить
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
