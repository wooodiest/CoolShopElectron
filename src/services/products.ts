import type { Product } from '../models/Product';

const API_BASE = 'https://dummyjson.com';

function setCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() }));
  } catch {}
}

function getCache<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.value as T;
  } catch {
    return undefined;
  }
}

export async function getProducts(): Promise<Product[]> {
  const cacheKey = 'products:all';
  try {
    const res = await fetch(`${API_BASE}/products?limit=30`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    const products = (json?.products ?? []) as Product[];
    setCache(cacheKey, products);
    return products;
  } catch {
    const cached = getCache<Product[]>(cacheKey);
    if (cached) return cached;
    throw new Error('Failed to load products (no cache available).');
  }
}

export async function getProduct(id: number): Promise<Product> {
  const cacheKey = `product:${id}`;
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Network error');
    const product = await res.json() as Product;
    setCache(cacheKey, product);
    return product;
  } catch {
    const cached = getCache<Product>(cacheKey);
    if (cached) return cached;
    throw new Error('Failed to load product (no cache available).');
  }
} 