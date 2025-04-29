
import React, { createContext, useContext, useState, useEffect } from 'react';

// Генерация рандомного секретного ключа при первом запуске
const generateSecretKey = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

interface AdminSecretContextType {
  secretKey: string;
  isValidSecretKey: (key: string) => boolean;
  siteSettings: {
    starPrice: number;
    minStars: number;
    maxStars: number;
    companyName: string;
    phoneNumber: string;
  };
  updateSettings: (settings: Partial<AdminSecretContextType['siteSettings']>) => void;
}

const DEFAULT_SETTINGS = {
  starPrice: 1.72,
  minStars: 50,
  maxStars: 500,
  companyName: 'ИП Иванов И.И.',
  phoneNumber: '+79883115645'
};

const AdminSecretContext = createContext<AdminSecretContextType>({
  secretKey: '',
  isValidSecretKey: () => false,
  siteSettings: DEFAULT_SETTINGS,
  updateSettings: () => {}
});

export const useAdminSecret = () => useContext(AdminSecretContext);

export const AdminSecretProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [secretKey, setSecretKey] = useState('');
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  
  useEffect(() => {
    // Восстанавливаем ключ из localStorage или генерируем новый
    const savedKey = localStorage.getItem('adminSecretKey');
    const newKey = savedKey || generateSecretKey();
    
    if (!savedKey) {
      localStorage.setItem('adminSecretKey', newKey);
      console.log('New admin access key generated:', newKey);
    }
    
    setSecretKey(newKey);
    
    // Загружаем настройки сайта из localStorage
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const isValidSecretKey = (key: string) => {
    return key === secretKey;
  };
  
  const updateSettings = (newSettings: Partial<typeof siteSettings>) => {
    const updatedSettings = { ...siteSettings, ...newSettings };
    setSiteSettings(updatedSettings);
    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
  };
  
  return (
    <AdminSecretContext.Provider value={{ 
      secretKey, 
      isValidSecretKey, 
      siteSettings,
      updateSettings
    }}>
      {children}
    </AdminSecretContext.Provider>
  );
};
