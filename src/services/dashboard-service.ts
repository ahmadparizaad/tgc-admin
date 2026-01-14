import { apiClient } from './api-client';
import type { ClientResponse } from '@/shared/types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeSubscriptions: number;
  todayCalls: number;
  monthlyRevenue: number;
  callAccuracy: number;
  totalCalls: number;
}

export interface SubscriptionMetrics {
  activeByPlan: {
    daily: number;
    weekly: number;
  };
  totalActive: number;
  expiringToday: number;
  expiredRecently: number;
}

export interface Payment {
  _id: string;
  user: {
    _id: string;
    mobile: string;
  };
  plan: 'daily' | 'weekly';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<ClientResponse<DashboardStats>> => {
  return apiClient<DashboardStats>('/admin/dashboard/stats');
};

/**
 * Get recent payments
 */
export const getRecentPayments = async (
  limit = 10
): Promise<ClientResponse<{ payments: Payment[] }>> => {
  return apiClient<{ payments: Payment[] }>(`/admin/dashboard/recent-payments?limit=${limit}`);
};

/**
 * Get subscription metrics
 */
export const getSubscriptionMetrics = async (): Promise<ClientResponse<SubscriptionMetrics>> => {
  return apiClient<SubscriptionMetrics>('/admin/dashboard/subscription-metrics');
};

/**
 * Get revenue trend data
 */
export const getRevenueTrend = async (): Promise<ClientResponse<{ trend: { name: string; revenue: number }[] }>> => {
  return apiClient<{ trend: { name: string; revenue: number }[] }>('/admin/dashboard/revenue-trend');
};

const dashboardService = {
  getDashboardStats,
  getRecentPayments,
  getSubscriptionMetrics,
  getRevenueTrend,
};

export default dashboardService;
