import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import closeIcon from '../assets/x.svg';
// Reusable Components
import Navbar from '../components/navbar';
import ProductGrid from '../components/productgrid';
import ProductModal from '../components/productmodal';

const Products = () => {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [mainType, setMainType] = useState('GLASSES');
  const [selectedCollection, setSelectedCollection] = useState('VIEW ALL');

  const collections = [
    "VIEW ALL", 
    "2026 COLLECTION", 
    "FALL COLLECTION",
    "BOLD COLLECTION", 
    "BESTSELLING"
  ];

  // --- DATA FETCHING ---
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      // Filter by main type (GLASSES or SUNGLASSES)
      let query = supabase.from('products').select('*').contains('categories', [mainType]);

      // Filter by specific collection if not "VIEW ALL"
      if (selectedCollection !== 'VIEW ALL') {
        query = query.contains('categories', [selectedCollection]);
      }

      const { data, error } = await query.order('id', { ascending: true });
      
      if (!error) {
        setItems(data);
      } else {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    getProducts();
  }, [mainType, selectedCollection]);

  // --- CART LOGIC ---
  const addToCart = () => {
    if (!selectedProduct) return;

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === selectedProduct.id);

    let updatedCart;

    if (existingItemIndex !== -1) {
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...existingCart, { ...selectedProduct, quantity: 1 }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Dispatch event so Navbar updates the count immediately
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // --- HANDLERS ---
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className='h-screen w-full bg-white font-host overflow-hidden flex flex-col relative'>
      
      {/* 1. REUSABLE PRODUCT MODAL */}
      <ProductModal 
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={addToCart}
      />

      {/* 2. MOBILE FILTER MODAL */}
      <div className={`fixed inset-0 z-[300] transition-all duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleFilter}
        />
        <div className={`absolute left-0 top-0 h-full w-full bg-white p-10 transition-transform duration-500 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className='flex justify-between items-center mb-10'>
            <span className='text-[32px] font-poppins font-extralight tracking-tight uppercase'>Filter</span>
            <button onClick={toggleFilter} className='w-4 h-4'>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>

          <div className='mt-6 mb-8 flex gap-2 text-[12px] font-semibold tracking-tight font-poppins'>
            <button
              onClick={() => { setMainType('GLASSES'); setSelectedCollection('VIEW ALL'); }}
              className={mainType === 'GLASSES' ? 'text-black' : 'text-gray-300'}
            >
              GLASSES
            </button>
            <span className='text-gray-300'>/</span>
            <button
              onClick={() => { setMainType('SUNGLASSES'); setSelectedCollection('VIEW ALL'); }}
              className={mainType === 'SUNGLASSES' ? 'text-black' : 'text-gray-300'}
            >
              SUNGLASSES
            </button>
          </div>

          <ul className='space-y-2'>
            {collections.map((col) => (
              <li
                key={col}
                onClick={() => { setSelectedCollection(col); toggleFilter(); }}
                className={`text-[12px] cursor-pointer tracking-tight uppercase font-poppins ${selectedCollection === col ? 'font-semibold text-black' : 'text-gray-600'}`}
              >
                {col}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. MOBILE FILTER TRIGGER */}
      <button 
        onClick={toggleFilter} 
        className='w-full lg:hidden flex justify-between items-center pt-16 px-6 pb-2 border-b bg-white sticky top-0 z-10'
      >
        <span className='text-[11px] uppercase'>① {mainType}</span>
        <span className='text-[11px] uppercase'>FILTER</span>
      </button>

      {/* 4. LAYOUT WRAPPER */}
      <div className='flex flex-1 overflow-hidden'>
        
        {/* DESKTOP SIDEBAR */}
        <aside className='hidden lg:block w-[260px] min-w-[260px] h-full pt-24 px-10 border-r border-gray-50 bg-white'>
          <div className='mt-6 mb-6 flex gap-2 text-[12px] font-semibold tracking-tight'>
            <button 
              onClick={() => { setMainType('GLASSES'); setSelectedCollection('VIEW ALL'); }} 
              className={mainType === 'GLASSES' ? 'text-black' : 'text-gray-300 hover:text-black transition-colors'}
            >
              GLASSES
            </button>
            <span className='text-gray-300'>/</span>
            <button 
              onClick={() => { setMainType('SUNGLASSES'); setSelectedCollection('VIEW ALL'); }} 
              className={mainType === 'SUNGLASSES' ? 'text-black' : 'text-gray-300 hover:text-black transition-colors'}
            >
              SUNGLASSES
            </button>
          </div>

          <ul className='space-y-2.5'>
            {collections.map((col) => (
              <li 
                key={col} 
                onClick={() => setSelectedCollection(col)} 
                className={`text-[12px] cursor-pointer tracking-tight hover:underline ${selectedCollection === col ? 'font-bold' : 'text-gray-600'}`}
              >
                {col}
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <main className='flex-1 h-full overflow-y-auto pt-10 lg:pt-24 px-6 lg:px-12 bg-[#F6F6F6] mt-6'>
          <div className='flex items-center gap-2 mb-8'>
            <h1 className='text-[12px] uppercase font-bold tracking-tight'>
              {mainType} / {selectedCollection}
            </h1>
          </div>

          {/* REUSABLE PRODUCT GRID */}
          <ProductGrid 
            items={items} 
            loading={loading} 
            onProductClick={handleProductClick} 
          />
        </main>
      </div>
    </div>
  );
};

export default Products;