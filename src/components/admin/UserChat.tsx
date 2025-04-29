
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, User } from "lucide-react";

interface Message {
  id: string;
  from: 'admin' | 'user';
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatUser {
  email: string;
  name?: string;
  lastActive: string;
  unreadCount: number;
}

interface UserChatProps {
  adminName?: string;
}

const UserChat: React.FC<UserChatProps> = ({ adminName = "Администратор" }) => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Загрузка списка пользователей и сообщений
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Загрузка сообщений при выборе пользователя
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser);
      // Помечаем сообщения как прочитанные
      markMessagesAsRead(selectedUser);
    }
  }, [selectedUser]);
  
  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const loadUsers = () => {
    // В реальном приложении здесь будет запрос к API
    // Получаем список зарегистрированных пользователей из localStorage
    const registeredUsers: ChatUser[] = [];
    
    // Проверяем наличие пользователей в localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('userEmail_')) {
        const email = localStorage.getItem(key);
        if (email) {
          const nameKey = 'userName_' + key.split('_')[1];
          const name = localStorage.getItem(nameKey) || undefined;
          
          // Получаем количество непрочитанных сообщений
          const messages = JSON.parse(localStorage.getItem(`chat_${email}`) || '[]') as Message[];
          const unreadCount = messages.filter(m => m.from === 'user' && !m.read).length;
          
          registeredUsers.push({
            email,
            name,
            lastActive: new Date().toISOString(),
            unreadCount
          });
        }
      }
    }
    
    // Если нет пользователей из localStorage, добавляем тестовых
    if (registeredUsers.length === 0) {
      registeredUsers.push(
        {
          email: 'user@gmail.com',
          name: 'Пользователь Google',
          lastActive: new Date().toISOString(),
          unreadCount: 2
        },
        {
          email: 'test@example.com',
          name: 'Тестовый пользователь',
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          unreadCount: 0
        }
      );
    }
    
    setUsers(registeredUsers);
    
    // Если есть хотя бы один пользователь, выбираем его
    if (registeredUsers.length > 0 && !selectedUser) {
      setSelectedUser(registeredUsers[0].email);
    }
  };
  
  const loadMessages = (userEmail: string) => {
    // В реальном приложении здесь будет запрос к API
    let userMessages = JSON.parse(localStorage.getItem(`chat_${userEmail}`) || '[]') as Message[];
    
    // Если нет сообщений, добавляем тестовые
    if (userMessages.length === 0 && userEmail === 'user@gmail.com') {
      userMessages = [
        {
          id: '1',
          from: 'user',
          text: 'Здравствуйте! У меня вопрос по оплате.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          from: 'user',
          text: 'Не могу найти, где посмотреть статус заказа.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false
        }
      ];
      localStorage.setItem(`chat_${userEmail}`, JSON.stringify(userMessages));
    }
    
    setMessages(userMessages);
  };
  
  const markMessagesAsRead = (userEmail: string) => {
    const userMessages = JSON.parse(localStorage.getItem(`chat_${userEmail}`) || '[]') as Message[];
    
    const updatedMessages = userMessages.map(msg => {
      if (msg.from === 'user' && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    localStorage.setItem(`chat_${userEmail}`, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    
    // Обновляем список пользователей, чтобы обновить счетчик непрочитанных
    loadUsers();
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'admin',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${selectedUser}`, JSON.stringify(updatedMessages));
    setNewMessage("");
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getUserName = (email: string) => {
    const user = users.find(u => u.email === email);
    return user?.name || email;
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
      {/* Список пользователей */}
      <Card className="md:col-span-1 flex flex-col">
        <CardHeader className="px-3 py-4">
          <CardTitle className="text-base">Пользователи</CardTitle>
          <CardDescription>Все зарегистрированные пользователи</CardDescription>
        </CardHeader>
        <CardContent className="px-3 flex-grow overflow-auto">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {users.map(user => (
                <div 
                  key={user.email}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                    selectedUser === user.email 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedUser(user.email)}
                >
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs opacity-70">
                        {formatDate(user.lastActive)}
                      </p>
                    </div>
                    <p className="text-xs truncate opacity-70">
                      {user.email}
                    </p>
                  </div>
                  {user.unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {user.unreadCount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Чат */}
      <Card className="md:col-span-3 flex flex-col">
        <CardHeader className="px-4 py-3 border-b">
          {selectedUser ? (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(getUserName(selectedUser))}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{getUserName(selectedUser)}</CardTitle>
                <CardDescription className="text-xs">{selectedUser}</CardDescription>
              </div>
            </div>
          ) : (
            <CardTitle>Выберите пользователя</CardTitle>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow p-0 overflow-hidden">
          {selectedUser ? (
            <ScrollArea className="h-full px-4 py-3">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full py-8 text-muted-foreground">
                    <p>Нет сообщений. Начните диалог!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.from === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.from === 'admin' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-secondary rounded-tl-none'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <User className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2">Выберите пользователя для начала диалога</p>
              </div>
            </div>
          )}
        </CardContent>
        
        {selectedUser && (
          <CardFooter className="p-3 border-t">
            <div className="flex items-center w-full space-x-2">
              <Input
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-grow"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UserChat;
