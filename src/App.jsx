import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import CartPage from './CartPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isHome = currentPath === '/';
  const isSearch = currentPath === '/search';
  const isOrders = currentPath === '/orders';
  const isPlans = currentPath === '/plans';

  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<div className="p-8 text-center text-gray-500 font-bold mt-20">Orders coming soon...</div>} />
        <Route path="/plans" element={<div className="p-8 text-center text-gray-500 font-bold mt-20">My Plans coming soon...</div>} />
      </Routes>

      {/* Shared Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e5e7eb] bg-white grid md:hidden grid-cols-4 py-1 pb-safe">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-[3px] py-[6px] px-1 font-[600] text-[0.68rem] text-center transition-colors border-none bg-transparent ${isHome ? 'text-[#cc2128]' : 'text-[#6b7280]'}`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          Home
        </button>
        <button 
          onClick={() => navigate('/search')}
          className={`flex flex-col items-center gap-[3px] py-[6px] px-1 font-[600] text-[0.68rem] text-center transition-colors border-none bg-transparent ${isSearch ? 'text-[#cc2128]' : 'text-[#6b7280]'}`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          Search
        </button>
        <button 
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center gap-[3px] py-[6px] px-1 font-[600] text-[0.68rem] text-center transition-colors border-none bg-transparent ${isOrders ? 'text-[#cc2128]' : 'text-[#6b7280]'}`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          Orders
        </button>
        <button 
          onClick={() => navigate('/plans')}
          className={`flex flex-col items-center gap-[3px] py-[6px] px-1 font-[600] text-[0.68rem] text-center transition-colors border-none bg-transparent ${isPlans ? 'text-[#cc2128]' : 'text-[#6b7280]'}`}
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="21"></line></svg>
          </div>
          My Plans
        </button>
      </nav>
    </div>
  );
}

export default App;
