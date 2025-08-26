import React from 'react';

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
} 