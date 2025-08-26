import React from 'react';

export default function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="p-3 border border-red-200 bg-red-50 text-red-700 rounded flex items-center justify-between gap-3">
      <span>{message}</span>
      {onRetry && (
        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
} 