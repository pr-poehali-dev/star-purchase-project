
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    // Проверяем, зарегистрирован ли пользователь
    setTimeout(() => {
      const userId = localStorage.getItem(`userPassword_${email}`);
      if (userId && localStorage.getItem(`userPassword_${email}`) === password) {
        // Успешный вход
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", localStorage.getItem(`userName_${email}`) || "");
        
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в систему",
        });
        
        navigate("/");
      } else {
        // Ошибка входа
        setLoginError("Неверный email или пароль");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setRegisterError("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setRegisterError("Пароль должен содержать не менее 6 символов");
      return;
    }

    setIsLoading(true);
    setRegisterError("");

    // Имитация регистрации
    setTimeout(() => {
      const existingUser = localStorage.getItem(`userPassword_${email}`);
      if (existingUser) {
        setRegisterError("Пользователь с таким email уже существует");
        setIsLoading(false);
        return;
      }

      // Сохраняем данные пользователя
      localStorage.setItem(`userPassword_${email}`, password);
      localStorage.setItem(`userName_${email}`, name);
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      
      toast({
        title: "Успешная регистрация",
        description: "Вы успешно зарегистрировались и вошли в систему",
      });
      
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // Имитация входа через Google
    setTimeout(() => {
      const randomEmail = `user${Math.floor(Math.random() * 1000)}@gmail.com`;
      const randomName = "Пользователь Google";
      
      localStorage.setItem(`userPassword_${randomEmail}`, "google-auth");
      localStorage.setItem(`userName_${randomEmail}`, randomName);
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", randomEmail);
      localStorage.setItem("userName", randomName);
      
      toast({
        title: "Успешный вход через Google",
        description: "Вы успешно авторизовались через Google",
      });
      
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container-1920 mx-auto py-8 px-4">
        <div className="content-container max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === "login" ? "Вход в аккаунт" : "Регистрация"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Войдите, чтобы получить доступ к своему аккаунту" 
                  : "Создайте новый аккаунт для использования сервиса"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Вход</TabsTrigger>
                  <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>{loginError}</div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Вход..." : "Войти"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {registerError && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>{registerError}</div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Имя</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="register-name" 
                          placeholder="Иван Иванов" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="your@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="register-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Минимум 6 символов
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="confirm-password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <div className="px-6 pb-6">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-sm text-muted-foreground">или</span>
                <div className="flex-grow border-t"></div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Войти через Google
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
