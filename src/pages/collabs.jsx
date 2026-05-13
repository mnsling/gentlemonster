import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/navbar';
import ProductGrid from '../components/productgrid';
import ProductModal from '../components/productmodal';

const Collabs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCollab, setSelectedCollab] = useState('Circuit Collection');

  const collabFilters = [
    {
      name: 'Circuit\nCollection',
      id: 'Circuit Collection',
      img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/popup_1_pc.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/412c202a-4298-401d-8df3-676268218a56/storylist_pc_05_3840_1800.jpg',
      description: 'The Circuit Collection revolves around the theme “Disney × F1®,” showcasing eyewear that highlights athleticism inspired by the structural language of racing cars.'
    },
    {
      name: '2026\nCollection',
      id: '2026 Collection',
      img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_popup_01-pc.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/5b65b98e-d29a-4a49-a1a2-fc6a9de0136d/plp_pc_3840_-1800.jpg',
      description: 'The 2026 Bouquet Collection introduces an elevated range of frames featuring loops, tangles, and ties inspired by the natural complexity of botanical structures.'
    },
    {
      name: 'Fall\nCollection',
      id: 'Fall Collection',
      img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_4_campaign_imgs_pc_1600x1080.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/a08f02e0-7421-4082-8c58-38bd6e2be0ca/plp_0_pc_3840*1800.jpg',
      description: 'The 2025 Fall Collection presents modern sophistication through slimmed frames and understated details, perfectly balanced by dynamic and tasteful metallic colorways.'
    },
    {
      name: '2025\nCollection',
      id: '2025 Collection',
      img: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/5874dccc-8193-49eb-9dea-b3685e830df9/plp_0_pc_3840*1800.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/5874dccc-8193-49eb-9dea-b3685e830df9/plp_0_pc_3840*1800.jpg',
      description: 'Reinterpreting futurism, the BOLD Collection features innovative shield-shaped bridges and acetate frames that evoke a dynamic sense of speed and motion.'
    },
    {
      name: 'Pocket\nCollection',
      id: 'Pocket collection',
      img: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/e5dd0a6e-4772-4128-9ce0-42a83e985cf0/pc-plp-collection-h1.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/e5dd0a6e-4772-4128-9ce0-42a83e985cf0/pc-plp-collection-h1.jpg',
      description: 'The Pocket Collection features portable, compact folding designs that blend Gentle Monster’s modern aesthetics with functional, high-fashion portability for daily use.'
    },
    {
      name: 'Maison\nMargiela',
      id: 'Maison Margiela',
      img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/maisonMargiela2025/campaignImage-2-pc.jpg',
      banner: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/9a59b0d9-5dc4-4cd7-a975-3e98c8a8018e/hero-pc-plp-renewal.jpg',
      description: 'This third collaboration explores the intersection of classicism and futurism, merging cybercore aesthetics with Maison Margiela’s iconic four white stitches.'
    },
  ];

  const activeFilter = collabFilters.find(f => f.id === selectedCollab);

  useEffect(() => {
    const getCollabs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('collabs')
        .select('*')
        .contains('categories', [selectedCollab.toUpperCase()]);

      if (!error) setItems(data);
      setLoading(false);
    };
    getCollabs();
  }, [selectedCollab]);

  const addToCart = () => {
    if (!selectedProduct) return;
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === selectedProduct.id);
    let updatedCart = [...existingCart];
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...selectedProduct, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className='h-screen w-full bg-white font-host overflow-hidden flex flex-col relative'>
      <Navbar />

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={addToCart}
      />

      <main className='flex-1 h-full overflow-y-auto pt-[50px] scroll-smooth'>

        {/* --- CIRCLE FILTER MENU (REMOVED STICKY) --- */}
        <div className="w-full flex justify-center py-6 border-b border-neutral-100 bg-white">
          <div className="flex gap-6 overflow-x-auto no-scrollbar px-10 items-start pt-6 pb-6">
            {collabFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedCollab(filter.id)}
                className="flex flex-col items-center flex-shrink-0 group outline-none"
              >
                <div
                  className={`w-[65px] h-[65px] lg:w-[70px] lg:h-[70px] rounded-full bg-neutral-200 bg-cover bg-center transition-all duration-500 ${selectedCollab === filter.id
                    ? 'ring-2 ring-black ring-offset-4 scale-105'
                    : 'group-hover:scale-105'
                    }`}
                  style={{ backgroundImage: `url(${filter.img})` }}
                />
                <span className={`mt-4 text-[10px] uppercase tracking-tighter text-center leading-tight whitespace-pre-line ${selectedCollab === filter.id ? 'font-bold text-black' : 'text-neutral-400 group-hover:text-black'
                  }`}>
                  {filter.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- CAMPAIGN BANNER --- */}
        {activeFilter?.banner && (
          <div className="w-full h-[200px] lg:h-[300px] relative overflow-hidden bg-black transition">
            <img
              src={activeFilter.banner}
              alt="Campaign Banner"
              className="w-full h-full object-cover opacity-90 animate-fade-in"
            />
            <div className="hidden absolute inset-0 lg:flex flex-col items-center justify-center bg-black/40 text-white transition">
              <h2 className="text-[24px] font-playfair lg:text-[40px] font-light tracking-tight uppercase">
                {selectedCollab}
              </h2>
              <p className="mt-4 text-[12px] lg:text-[14px] max-w-xl text-center opacity-80">
                {activeFilter.description}
              </p>
            </div>
          </div>
        )}

        {/* --- PRODUCT GRID AREA --- */}
        <div className="px-6 lg:px-12 py-12">
          <div className='flex items-center justify-between mb-10 border-b border-neutral-100 pb-4'>
            <h1 className='text-[12px] uppercase font-bold tracking-tight'>
              {selectedCollab}
            </h1>
            <span className='text-[12px] text-neutral-400 uppercase tracking-tight'>
              {items.length} Products
            </span>
          </div>

          <ProductGrid
            items={items}
            loading={loading}
            onProductClick={(p) => {
              setSelectedProduct(p);
              setIsModalOpen(true);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Collabs;