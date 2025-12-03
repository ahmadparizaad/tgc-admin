'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/templates';
import { Button, Input } from '@/components/atoms';
import { createCall } from '@/services/call-service';
import type { CreateCallData } from '@/services/call-service';

const COMMODITY_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'nifty', label: 'Nifty' },
  { value: 'copper', label: 'Copper' },
];

const TYPE_OPTIONS = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
];

export default function NewCallPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateCallData>({
    commodity: 'gold',
    type: 'buy',
    entryPrice: 0,
    target: 0,
    stopLoss: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['entryPrice', 'target', 'stopLoss'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.entryPrice <= 0) {
      setError('Entry price must be greater than 0');
      return;
    }
    if (formData.target <= 0) {
      setError('Target must be greater than 0');
      return;
    }
    if (formData.stopLoss <= 0) {
      setError('Stop loss must be greater than 0');
      return;
    }

    // Validate target and stoploss based on call type
    if (formData.type === 'buy') {
      if (formData.target <= formData.entryPrice) {
        setError('For BUY calls, target must be greater than entry price');
        return;
      }
      if (formData.stopLoss >= formData.entryPrice) {
        setError('For BUY calls, stop loss must be less than entry price');
        return;
      }
    } else {
      if (formData.target >= formData.entryPrice) {
        setError('For SELL calls, target must be less than entry price');
        return;
      }
      if (formData.stopLoss <= formData.entryPrice) {
        setError('For SELL calls, stop loss must be greater than entry price');
        return;
      }
    }

    setIsSubmitting(true);

    const response = await createCall(formData);

    if (response.success) {
      router.push('/calls');
    } else {
      setError(response.error || 'Failed to create call');
    }

    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Link href="/calls">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">New Call</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Create a new trading call
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Commodity & Type Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="commodity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Commodity
                </label>
                <select
                  id="commodity"
                  name="commodity"
                  value={formData.commodity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {COMMODITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Call Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Fields */}
            <div>
              <label
                htmlFor="entryPrice"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Entry Price (₹)
              </label>
              <Input
                type="number"
                id="entryPrice"
                name="entryPrice"
                value={formData.entryPrice || ''}
                onChange={handleChange}
                placeholder="Enter entry price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="target"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Target Price (₹)
                </label>
                <Input
                  type="number"
                  id="target"
                  name="target"
                  value={formData.target || ''}
                  onChange={handleChange}
                  placeholder="Enter target"
                  step="0.01"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.type === 'buy' ? 'Should be higher than entry' : 'Should be lower than entry'}
                </p>
              </div>

              <div>
                <label
                  htmlFor="stopLoss"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Stop Loss (₹)
                </label>
                <Input
                  type="number"
                  id="stopLoss"
                  name="stopLoss"
                  value={formData.stopLoss || ''}
                  onChange={handleChange}
                  placeholder="Enter stop loss"
                  step="0.01"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.type === 'buy' ? 'Should be lower than entry' : 'Should be higher than entry'}
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/calls">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                Create Call
              </Button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>For <strong>BUY</strong> calls: Target &gt; Entry &gt; Stop Loss</li>
            <li>For <strong>SELL</strong> calls: Stop Loss &gt; Entry &gt; Target</li>
            <li>Calls are automatically set to &quot;active&quot; status when created</li>
            <li>You can update the status later when targets are hit or calls expire</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
