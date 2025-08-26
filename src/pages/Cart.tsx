import React from 'react';
import { useCartStore } from '../store/cart';
import CachedImage from '../components/ui/CachedImage';

export default function Cart() {
  const items = useCartStore(s => s.items);
  const removeItem = useCartStore(s => s.removeItem);
  const setQuantity = useCartStore(s => s.setQuantity);
  const entries = Object.values(items);
  const total = entries.reduce((sum, it) => sum + it.quantity * it.product.price, 0);

  if (entries.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      <div className="space-y-4">
        {entries.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-3 border rounded p-2">
            <CachedImage src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{product.title}</div>
              <div className="text-sm text-gray-600">${product.price}</div>
            </div>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(product.id, Number(e.target.value))}
            />
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => removeItem(product.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right font-semibold">Total: ${total.toFixed(2)}</div>
    </div>
  );
} 