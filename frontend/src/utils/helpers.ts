import { format, parseISO, isValid, differenceInDays, addDays } from 'date-fns';

export const formatDate = (dateString: string, formatStr: string = 'PPP') => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : 'Invalid Date';
  } catch {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const generateTimeSlots = (start: string, end: string, interval: number = 30) => {
  const slots = [];
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);
  
  while (startTime < endTime) {
    slots.push(format(startTime, 'HH:mm'));
    startTime.setMinutes(startTime.getMinutes() + interval);
  }
  
  return slots;
};

export const calculateEventDuration = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  
  if (durationInMinutes < 60) {
    return `${Math.round(durationInMinutes)} minutes`;
  } else if (durationInMinutes < 1440) {
    return `${Math.round(durationInMinutes / 60)} hours`;
  } else {
    return `${Math.round(durationInMinutes / 1440)} days`;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};