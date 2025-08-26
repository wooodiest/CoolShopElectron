import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Profile from './Components/Profile';
import { getProducts  } from './services/products';
import type { Product } from './models/Product';

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

function Product() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">Product</h1>
      <p className="text-gray-600">Coming soon: single product view.</p>
    </div>
  );
}

function Cart() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">Cart</h1>
      <p className="text-gray-600">Coming soon: your cart.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav className="px-4 py-3 border-b flex gap-4 items-center">
        <Link to="/catalog" className="text-blue-600">Catalog</Link>
        <Link to="/product/1" className="text-blue-600">Product</Link>
        <Link to="/cart" className="text-blue-600">Cart</Link>
        <div className="ml-auto">
          <Profile />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}