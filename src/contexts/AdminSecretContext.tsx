
import React, { createContext, useContext, useState, useEffect } from 'react';

// Фиксированный секретный ключ для доступа к админ-панели
const ADMIN_SECRET_KEY = "admin_secret_2025_key";

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
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  
  useEffect(() => {
    // Загружаем настройки сайта из localStorage
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const isValidSecretKey = (key: string) => {
    return key === ADMIN_SECRET_KEY;
  };
  
  const updateSettings = (newSettings: Partial<typeof siteSettings>) => {
    const updatedSettings = { ...siteSettings, ...newSettings };
    setSiteSettings(updatedSettings);
    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
  };
  
  return (
    <AdminSecretContext.Provider value={{ 
      secretKey: ADMIN_SECRET_KEY, 
      isValidSecretKey, 
      siteSettings,
      updateSettings
    }}>
      {children}
    </AdminSecretContext.Provider>
  );
};
