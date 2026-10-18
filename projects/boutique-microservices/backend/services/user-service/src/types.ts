export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  preferences: UserPreferences;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  currency: string;
  language: string;
  newsletter: boolean;
  promotions: boolean;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
