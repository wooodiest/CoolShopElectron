import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useParams } from 'react-router-dom';
import Profile from './Components/Profile';
import { getProducts } from './services/products';
import type { Product } from './models/Product';
import { getProduct } from './services/products';
import { useCartStore } from './store/cart';

function Catalog() {
  const [items, setItems] = React.useState<Product[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      }
    })();
    return () => { cancelled = true };
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Catalog</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!items) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Catalog</h1>
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow">
            <img src={p.thumbnail} alt={p.title} className="w-full h-40 object-cover" />
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

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const addItem = useCartStore(s => s.addItem);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getProduct(Number(id));
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      }
    })();
    return () => { cancelled = true };
  }, [id]);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Product</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Product</h1>
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover rounded" />
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

function Cart() {
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
            <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded" />
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

export default function App() {
  return (
    <BrowserRouter>
      <nav className="px-4 py-3 border-b flex gap-4 items-center">
        <Link to="/catalog" className="text-blue-600">Catalog</Link>
        <Link to="/cart" className="text-blue-600">Cart</Link>
        <div className="ml-auto">
          <Profile />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}