export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inventory: number;
  brand?: string;
  material?: string;
  careInstructions?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  featured?: boolean;
  newArrival?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  productCount: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
