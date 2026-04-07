export const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
export const validatePhone = (phone: string) => {
    const usPhoneRegex = /^(?:\+967\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3}$/;
    return usPhoneRegex.test(phone);
  };
  
export const validateName = (name: string) => {
    return name.trim().split(/\s+/).length >= 2;
  };
  