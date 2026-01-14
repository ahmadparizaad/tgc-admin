import { apiClient } from './api-client';
import type { ClientResponse } from '@/shared/types';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  tier: 'Regular' | 'Premium' | 'International';
  durationDays: number;
  durationLabel: string;
  price: number;
  currency: 'INR' | 'USD';
  maxTargetsVisible: number;
  reminderHours: number;
  isActive: boolean;
}

export const getSubscriptionPlans = async (): Promise<ClientResponse<SubscriptionPlan[]>> => {
  const response = await apiClient<{ plans: SubscriptionPlan[] }>('/admin/plans');
  return {
    ...response,
    data: response.data ? response.data.plans : null
  };
};

export const updateSubscriptionPlan = async (
  id: string, 
  data: Partial<SubscriptionPlan>
): Promise<ClientResponse<SubscriptionPlan>> => {
  const response = await apiClient<{ plan: SubscriptionPlan }>(`/admin/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return {
    ...response,
    data: response.data ? response.data.plan : null
  };
};

export const createSubscriptionPlan = async (
  data: Omit<SubscriptionPlan, '_id'>
): Promise<ClientResponse<SubscriptionPlan>> => {
  const response = await apiClient<{ plan: SubscriptionPlan }>('/admin/plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return {
    ...response,
    data: response.data ? response.data.plan : null
  };
};

export const deleteSubscriptionPlan = async (
  id: string
): Promise<ClientResponse<null>> => {
  const response = await apiClient<null>(`/admin/plans/${id}`, {
    method: 'DELETE',
  });
  return response;
};
