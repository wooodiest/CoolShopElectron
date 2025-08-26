import React from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/products';
import type { Product } from '../models/Product';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import CachedImage from '../components/ui/CachedImage';

export default function Catalog() {
  const [items, setItems] = React.useState<Product[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Catalog</h1>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={load} disabled={loading}>Refresh</button>
        </div>
        <ErrorMessage message={error} onRetry={load} />
      </div>
    );
  }

  if (loading || !items) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Catalog</h1>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={load} disabled={loading}>Refresh</button>
        </div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={load} disabled={loading}>Refresh</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow">
            <CachedImage src={p.thumbnail} alt={p.title} className="w-full h-40 object-cover" />
            <div className="p-3">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-sm text-gray-600">${p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 