import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

export default function NavBar() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const navigate = useNavigate();

  React.useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <nav className="px-4 py-3 border-b flex gap-4 items-center">
      <Link to="/catalog" className="text-blue-600">Catalog</Link>
      <Link to="/cart" className="text-blue-600">Cart</Link>
      <div className="ml-auto flex items-center gap-4">
        <span className={`inline-flex items-center gap-1 text-sm ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {isAuthenticated ? (
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => { logout(); navigate('/catalog'); }}>Logout</button>
        ) : (
          <Link to="/login" className="px-3 py-1 bg-blue-600 text-white rounded">Login</Link>
        )}
      </div>
    </nav>
  );
} 