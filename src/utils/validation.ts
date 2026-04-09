import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string) => {
  // Use libphonenumber-js for international validation
  // We try to parse it. If it's valid internationally, it returns an object.
  // We also handle cases where the user might not enter a '+' prefix by trying a few defaults if needed,
  // but usually, a real international validation requires the '+' or a country context.
  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (phoneNumber) {
      return phoneNumber.isValid();
    }
    
    // Fallback for numbers without + prefix (try to see if it looks like a valid local number)
    // If it's just digits and between 7-15, we might still want to allow it if the library can't parse it without context
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 12;
  } catch (error) {
    return false;
  }
};

export const validateName = (name: string) => {
  return name.trim().split(/\s+/).length >= 2;
};

