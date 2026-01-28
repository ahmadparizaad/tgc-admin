'use client';

import React from 'react';
import Button from '@/components/atoms/button';
import { Badge } from '@/components/atoms';
import type { Call } from '@/services/call-service';

interface TargetsModalProps {
  open: boolean;
  call: Call | null;
  onClose: () => void;
}

export default function TargetsModal({ open, call, onClose }: TargetsModalProps) {
  if (!open || !call) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const targets = call.targetPrices && call.targetPrices.length > 0 
    ? [...call.targetPrices].sort((a, b) => a.order - b.order)
    : [{ label: 'Target', price: call.target || 0, order: 0 }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {call.commodity === 'Custom' ? call.customCommodity : call.commodity}
              </h3>
              <div className="flex gap-2">
                <Badge variant={call.type === 'buy' ? 'success' : 'danger'}>
                  {call.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground mt-0.5">Entry: {formatPrice(call.entryPrice)}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Target Prices</p>
            <div className="space-y-3">
              {targets.map((t, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-success/30 hover:bg-success/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success text-[10px] font-bold">
                      T{i + 1}
                    </div>
                    <span className="text-sm font-semibold text-foreground uppercase">{t.label}</span>
                  </div>
                  <span className="text-lg font-bold text-success group-hover:scale-105 transition-transform">
                    {formatPrice(t.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button variant="secondary" className="w-full rounded-2xl py-3" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
