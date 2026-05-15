import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { DonationTransaction } from '@/types/campaign';

interface LiveDonationFeedProps {
  transactions: DonationTransaction[];
  totalRaised: number;
  goal: number;
  brandColor?: string;
}

export const LiveDonationFeed: React.FC<LiveDonationFeedProps> = ({
  transactions,
  totalRaised,
  goal,
  brandColor = '#1A1A1A',
}) => {
  const [displayTransactions, setDisplayTransactions] = useState<DonationTransaction[]>([]);
  const progressPercent = Math.min((totalRaised / goal) * 100, 100);

  useEffect(() => {
    // Keep last 8 transactions visible
    setDisplayTransactions(transactions.slice(-8).reverse());
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 w-96 border-2 rounded-2xl bg-white/95 backdrop-blur-sm p-6 z-40 shadow-2xl"
      style={{ borderColor: brandColor }}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: brandColor }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-2">
          Live Donations
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold" style={{ color: brandColor }}>
              €{totalRaised.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">of €{goal.toLocaleString()} goal</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-600">{progressPercent.toFixed(0)}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: brandColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[12px] text-gray-400 uppercase tracking-[0.3em]">
              Be the first to donate
            </p>
          </div>
        ) : (
          displayTransactions.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all"
            >
              {/* Color block */}
              <div
                className="w-6 h-6 rounded-md flex-shrink-0 shadow-md"
                style={{ backgroundColor: tx.color }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-gray-700 truncate">{tx.donor}</p>
                <p className="text-[10px] text-gray-400 truncate">{tx.message}</p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[13px] font-bold" style={{ color: brandColor }}>
                  +€{tx.amount}
                </p>
                <p className="text-[8px] text-gray-400 uppercase tracking-widest">
                  {tx.paymentMethod === 'card'
                    ? 'Card'
                    : tx.paymentMethod === 'crypto'
                      ? '₿'
                      : 'Bank'}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Total Donors</p>
          <p className="font-semibold text-gray-700">{new Set(displayTransactions.map((t) => t.donor)).size}</p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Avg Donation</p>
          <p className="font-semibold text-gray-700">
            €
            {displayTransactions.length
              ? Math.round(
                  displayTransactions.reduce((sum, t) => sum + t.amount, 0) /
                    displayTransactions.length
                )
              : 0}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Blocks</p>
          <p className="font-semibold text-gray-700">{displayTransactions.length}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveDonationFeed;
