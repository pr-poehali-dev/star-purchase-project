
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, User, LifeBuoy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  from: 'admin' | 'user';
  text: string;
  timestamp: string;
  read: boolean;
  senderName?: string;
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
  const [supportUsers, setSupportUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'support' | 'direct'>('support');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { toast } = useToast();
  
  // Загрузка списка пользователей
  useEffect(() => {
    loadUsers();
    
    // Обновление каждые 5 секунд для получения новых сообщений
    const intervalId = setInterval(() => {
      loadUsers();
      if (selectedUser) {
        loadMessages(selectedUser, chatType === 'support');
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Загрузка сообщений при выборе пользователя
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser, chatType === 'support');
      // Помечаем сообщения как прочитанные
      markMessagesAsRead(selectedUser, chatType === 'support');
    }
  }, [selectedUser, chatType]);
  
  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const loadUsers = () => {
    const registeredUsers: ChatUser[] = [];
    const supportUsersList: ChatUser[] = [];
    let unreadTotal = 0;
    
    // Сначала загружаем список обращений в техподдержку
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('support_chat_')) {
        const userEmail = key.replace('support_chat_', '');
        const supportMessages = JSON.parse(localStorage.getItem(key) || '[]') as Message[];
        
        if (supportMessages.length > 0) {
          // Ищем имя пользователя
          let userName = userEmail;
          for (let j = 0; j < localStorage.length; j++) {
            const nameKey = localStorage.key(j);
            if (nameKey?.startsWith('userName_')) {
              const userId = nameKey.split('_')[1];
              const email = localStorage.getItem(`userEmail_${userId}`);
              if (email === userEmail) {
                userName = localStorage.getItem(nameKey) || userEmail;
                break;
              }
            }
          }
          
          // Считаем непрочитанные сообщения
          const unreadCount = supportMessages.filter(m => m.from === 'user' && !m.read).length;
          
          if (unreadCount > 0) {
            unreadTotal += unreadCount;
          }
          
          supportUsersList.push({
            email: userEmail,
            name: userName,
            lastActive: supportMessages[supportMessages.length - 1].timestamp,
            unreadCount: unreadCount
          });
        }
      }
    }
    
    // Загружаем список пользователей для обычного чата
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('userEmail_')) {
        const userId = key.split('_')[1];
        const email = localStorage.getItem(key);
        
        if (email) {
          const nameKey = 'userName_' + userId;
          const name = localStorage.getItem(nameKey) || undefined;
          
          // Проверяем, есть ли непрочитанные сообщения в обычном чате
          const chatKey = `chat_${email}`;
          const messages = JSON.parse(localStorage.getItem(chatKey) || '[]') as Message[];
          const unreadCount = messages.filter(m => m.from === 'user' && !m.read).length;
          
          if (unreadCount > 0) {
            unreadTotal += unreadCount;
          }
          
          // Проверяем, не добавлен ли уже этот пользователь в список техподдержки
          if (!supportUsersList.some(u => u.email === email)) {
            registeredUsers.push({
              email,
              name,
              lastActive: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date().toISOString(),
              unreadCount
            });
          }
        }
      }
    }
    
    // Сортируем списки по наличию непрочитанных сообщений и дате последней активности
    const sortUsers = (a: ChatUser, b: ChatUser) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    };
    
    registeredUsers.sort(sortUsers);
    supportUsersList.sort(sortUsers);
    
    setUsers(registeredUsers);
    setSupportUsers(supportUsersList);
    setTotalUnreadCount(unreadTotal);
    
    // Обновляем localStorage для индикатора на интерфейсе
    localStorage.setItem('admin_unread_count', unreadTotal.toString());
    
    // Обновляем счетчик непрочитанных сообщений в техподдержке
    const supportUnreadCount = supportUsersList.reduce((acc, user) => acc + user.unreadCount, 0);
    localStorage.setItem('admin_unread_support_count', supportUnreadCount.toString());
    
    // Если выбранного пользователя нет, выбираем первого с непрочитанными сообщениями
    if (!selectedUser) {
      if (supportUsersList.length > 0 && supportUsersList.some(u => u.unreadCount > 0)) {
        setSelectedUser(supportUsersList.find(u => u.unreadCount > 0)?.email || supportUsersList[0].email);
        setChatType('support');
      } else if (registeredUsers.length > 0 && registeredUsers.some(u => u.unreadCount > 0)) {
        setSelectedUser(registeredUsers.find(u => u.unreadCount > 0)?.email || registeredUsers[0].email);
        setChatType('direct');
      } else if (supportUsersList.length > 0) {
        setSelectedUser(supportUsersList[0].email);
        setChatType('support');
      } else if (registeredUsers.length > 0) {
        setSelectedUser(registeredUsers[0].email);
        setChatType('direct');
      }
    }
  };
  
  const loadMessages = (userEmail: string, isSupport: boolean) => {
    const chatKey = isSupport ? `support_chat_${userEmail}` : `chat_${userEmail}`;
    const userMessages = JSON.parse(localStorage.getItem(chatKey) || '[]') as Message[];
    setMessages(userMessages);
  };
  
  const markMessagesAsRead = (userEmail: string, isSupport: boolean) => {
    const chatKey = isSupport ? `support_chat_${userEmail}` : `chat_${userEmail}`;
    const userMessages = JSON.parse(localStorage.getItem(chatKey) || '[]') as Message[];
    
    const updatedMessages = userMessages.map(msg => {
      if (msg.from === 'user' && !msg.read) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
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
      read: false,
      senderName: adminName
    };
    
    const chatKey = chatType === 'support' 
      ? `support_chat_${selectedUser}` 
      : `chat_${selectedUser}`;
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setNewMessage("");
    
    toast({
      title: "Сообщение отправлено",
      description: `Сообщение отправлено пользователю ${getUserName(selectedUser)}`,
    });
  };
  
  const handleUserSelect = (email: string, isSupport: boolean) => {
    setSelectedUser(email);
    setChatType(isSupport ? 'support' : 'direct');
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
    const user = [...users, ...supportUsers].find(u => u.email === email);
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
          <CardTitle className="text-base">Чаты с пользователями</CardTitle>
          <CardDescription>
            {totalUnreadCount > 0 ? 
              `У вас ${totalUnreadCount} непрочитанных сообщений` : 
              'Все сообщения прочитаны'}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="support" className="px-3">
          <TabsList className="w-full grid grid-cols-2 mb-2">
            <TabsTrigger value="support" className="flex items-center gap-1">
              <LifeBuoy className="h-4 w-4" />
              Поддержка
              {supportUsers.some(u => u.unreadCount > 0) && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {supportUsers.reduce((acc, u) => acc + u.unreadCount, 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Все
              {users.some(u => u.unreadCount > 0) && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {users.reduce((acc, u) => acc + u.unreadCount, 0)}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="support" className="mt-0">
            <CardContent className="px-0 py-2 flex-grow overflow-auto h-[450px]">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {supportUsers.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <LifeBuoy className="mx-auto h-8 w-8 opacity-30 mb-2" />
                      <p className="text-sm">Нет обращений в техподдержку</p>
                    </div>
                  ) : (
                    supportUsers.map(user => (
                      <div 
                        key={user.email + '_support'}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                          selectedUser === user.email && chatType === 'support'
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-secondary'
                        }`}
                        onClick={() => handleUserSelect(user.email, true)}
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
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="direct" className="mt-0">
            <CardContent className="px-0 py-2 flex-grow overflow-auto h-[450px]">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {users.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <User className="mx-auto h-8 w-8 opacity-30 mb-2" />
                      <p className="text-sm">Нет зарегистрированных пользователей</p>
                    </div>
                  ) : (
                    users.map(user => (
                      <div 
                        key={user.email}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                          selectedUser === user.email && chatType === 'direct'
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-secondary'
                        }`}
                        onClick={() => handleUserSelect(user.email, false)}
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
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
        </Tabs>
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
                <CardTitle className="text-base flex items-center gap-2">
                  {getUserName(selectedUser)}
                  {chatType === 'support' && (
                    <Badge variant="outline" className="ml-2 font-normal">
                      Техподдержка
                    </Badge>
                  )}
                </CardTitle>
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
