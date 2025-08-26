import React from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/products';
import type { Product } from '../models/Product';
import { useCartStore } from '../store/cart';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import CachedImage from '../components/ui/CachedImage';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const addItem = useCartStore(s => s.addItem);

  const load = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(Number(id));
      setProduct(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProduct(Number(id));
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [id]);

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Product</h1>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={load} disabled={loading}>Refresh</button>
        </div>
        <ErrorMessage message={error} onRetry={load} />
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Product</h1>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={load} disabled={loading}>Refresh</button>
        </div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <CachedImage src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover rounded" />
      <div>
        <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
        <div className="text-xl text-gray-700 mb-4">${product.price}</div>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => addItem(product, 1)}>
          Add to cart
        </button>
      </div>
    </div>
  );
} 