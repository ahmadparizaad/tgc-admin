'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { getAllPayments } from '@/services/payment-service';
import type { Payment } from '@/services/payment-service';
import type { PaginatedResponse, Pagination, ClientResponse } from '@/shared/types';

function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const response = await getAllPayments({ page: 1, limit: 10 });
      if (response.success && response.data) {
        setPayments(response.data.data || []);
        setPagination(response.data.pagination || null);
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const fetchPayments = async (page = 1) => {
    setIsLoading(true);
    const response: ClientResponse<PaginatedResponse<Payment>> = await getAllPayments({
      page,
      limit: 10,
      search: search || undefined,
      status: statusFilter || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

    if (response.success && response.data) {
      setPayments(response.data.data || []);
      setPagination(response.data.pagination || null);
    }
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchPayments(1);
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchPayments(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">View and filter all payment transactions</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <input
          type="text"
          placeholder="Search by user mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-input rounded-3xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-input rounded-3xl bg-background text-foreground">
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-input rounded-3xl bg-background text-foreground" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-input rounded-3xl bg-background text-foreground" />
        <Button type="submit" isLoading={isLoading}>Filter</Button>
      </form>

      {/* Payments Table */}
      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p>No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Txn ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{p.user?.mobile || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{p.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{p.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.status === 'completed' ? <Badge variant="success">Completed</Badge> : p.status === 'failed' ? <Badge variant="danger">Failed</Badge> : <Badge variant="warning">Pending</Badge>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{p.transactionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing {payments?.length || 0} of {pagination.total} payments</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrevPage || isLoading}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNextPage || isLoading}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <PaymentsContent />
    </DashboardLayout>
  );
}
