import { apiClient } from './api-client';
import type { ClientResponse, User, PaginatedResponse, Pagination } from '@/shared/types';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  subscriptionStatus?: 'active' | 'inactive';
}

export interface Payment {
  _id: string;
  id?: string;
  plan: 'daily' | 'weekly';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  phonepeTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsResponse {
  data: Payment[];
  pagination: Pagination;
}

/**
 * Get all users with pagination
 */
export const getUsers = async (
  params: GetUsersParams = {}
): Promise<ClientResponse<PaginatedResponse<User>>> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.subscriptionStatus) searchParams.set('subscriptionStatus', params.subscriptionStatus);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';

  return apiClient<PaginatedResponse<User>>(endpoint);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<ClientResponse<{ user: User }>> => {
  return apiClient<{ user: User }>(`/admin/users/${id}`);
};

/**
 * Get user payment history
 */
export const getUserPayments = async (
  id: string,
  page = 1,
  limit = 10
): Promise<ClientResponse<PaymentsResponse>> => {
  return apiClient<PaymentsResponse>(`/admin/users/${id}/payments?page=${page}&limit=${limit}`);
};

/**
 * Update user status (enable/disable)
 */
export const updateUserStatus = async (
  id: string,
  isActive: boolean
): Promise<ClientResponse<{ user: User }>> => {
  return apiClient<{ user: User }>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
};

/**
 * Activate subscription manually
 */
export const activateSubscription = async (
  id: string,
  plan: 'daily' | 'weekly'
): Promise<ClientResponse<{ user: User; message: string }>> => {
  return apiClient<{ user: User; message: string }>(`/admin/users/${id}/activate-subscription`, {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
};

const userService = {
  getUsers,
  getUserById,
  getUserPayments,
  updateUserStatus,
  activateSubscription,
};

export default userService;
