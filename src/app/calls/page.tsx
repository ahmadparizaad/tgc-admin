'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { getCalls, deleteCall } from '@/services/call-service';
import type { Call } from '@/services/call-service';
import type { Pagination, ClientResponse, PaginatedResponse } from '@/shared/types';

const COMMODITY_OPTIONS = [
  { value: '', label: 'All Commodities' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'nifty', label: 'Nifty' },
  { value: 'copper', label: 'Copper' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'hit_target', label: 'Hit Target' },
  { value: 'hit_stoploss', label: 'Hit Stoploss' },
  { value: 'expired', label: 'Expired' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
];

const getStatusBadgeVariant = (status: string): 'success' | 'danger' | 'warning' | 'default' => {
  switch (status) {
    case 'active':
      return 'warning';
    case 'hit_target':
      return 'success';
    case 'hit_stoploss':
      return 'danger';
    default:
      return 'default';
  }
};

const getCommodityColor = (commodity: string): string => {
  switch (commodity) {
    case 'gold':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'silver':
      return 'text-gray-500 dark:text-gray-400';
    case 'nifty':
      return 'text-blue-600 dark:text-blue-400';
    case 'copper':
      return 'text-orange-600 dark:text-orange-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

function CallsContent() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [commodity, setCommodity] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  // Initial data fetch using useEffect
  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const response = await getCalls({ page: 1, limit: 10 });
      if (response.success && response.data) {
        setCalls(response.data.data || []);
        setPagination(response.data.pagination || null);
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const fetchCalls = async (page: number) => {
    setIsLoading(true);
    const response: ClientResponse<PaginatedResponse<Call>> = await getCalls({
      page,
      limit: 10,
      commodity: commodity || undefined,
      status: status || undefined,
      type: type || undefined,
      sortBy: 'date',
      sortOrder: 'desc',
    });

    if (response.success && response.data) {
      setCalls(response.data.data || []);
      setPagination(response.data.pagination || null);
    }
    setIsLoading(false);
  };

  const handleFilter = async () => {
    setCurrentPage(1);
    await fetchCalls(1);
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchCalls(newPage);
  };

  const handleDelete = async (call: Call) => {
    if (!confirm(`Are you sure you want to delete this ${call.commodity} call?`)) {
      return;
    }

    const callId = call.id || call._id;
    if (!callId) return;

    setIsDeleting(callId);
    const response = await deleteCall(callId);
    
    if (response.success) {
      setCalls(calls.filter(c => (c.id || c._id) !== callId));
    } else {
      alert(response.error || 'Failed to delete call');
    }
    setIsDeleting(null);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calls</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage trading calls for commodities
          </p>
        </div>
        <Link href="/calls/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Call
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMMODITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <Button onClick={handleFilter} isLoading={isLoading}>
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p>No calls found</p>
            <Link href="/calls/new" className="mt-4">
              <Button variant="secondary" size="sm">Create your first call</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Commodity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stoploss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {calls.map((call) => {
                  const callId = call.id || call._id;
                  return (
                    <tr key={callId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(call.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold uppercase ${getCommodityColor(call.commodity)}`}>
                          {call.commodity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={call.type === 'buy' ? 'success' : 'danger'}>
                          {call.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatPrice(call.entryPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                        {formatPrice(call.target)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                        {formatPrice(call.stopLoss)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(call.status)}>
                          {call.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/calls/${callId}/edit`}>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(call)}
                            isLoading={isDeleting === callId}
                            disabled={isDeleting !== null}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {calls?.length || 0} of {pagination.total} calls
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallsPage() {
  return (
    <DashboardLayout>
      <CallsContent />
    </DashboardLayout>
  );
}
