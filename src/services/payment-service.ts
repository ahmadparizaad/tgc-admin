import { apiClient } from './api-client';
import type { ClientResponse, PaginatedResponse, Pagination } from '@/shared/types';

export interface Payment {
  _id: string;
  user?: { _id: string; mobile: string };
  plan: 'daily' | 'weekly' | 'custom';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

export interface PaymentsResponse {
  data: Payment[];
  pagination: Pagination;
}

export const getAllPayments = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  } = {}
): Promise<ClientResponse<PaginatedResponse<Payment>>> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.fromDate) searchParams.set('fromDate', params.fromDate);
  if (params.toDate) searchParams.set('toDate', params.toDate);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/admin/payments?${queryString}` : '/admin/payments';

  return apiClient<PaginatedResponse<Payment>>(endpoint);
};

const paymentService = { getAllPayments };
export default paymentService;
