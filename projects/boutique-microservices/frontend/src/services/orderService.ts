import apiClient from './api';
import { Order } from '../types';

export const orderService = {
  createOrder: async (orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
  }): Promise<Order> => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};