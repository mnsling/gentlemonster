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

  // Filter state - Defaults to the first collection
  const [selectedCollab, setSelectedCollab] = useState('Circuit Collection');

  // Your requested labels with placeholder image links
  const collabFilters = [
    { name: 'Circuit Collection', img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/circuit-collection/popup_1_pc.jpg' },
    { name: '2026 Collection', img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/2026-collection/img_popup_01-pc.jpg' },
    { name: 'Fall Collection', img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/fall2025/img/section2/story_4_campaign_imgs_pc_1600x1080.jpg' },
    { name: '2025 Collection', img: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/5874dccc-8193-49eb-9dea-b3685e830df9/plp_0_pc_3840*1800.jpg' },
    { name: 'Pocket collection', img: 'https://gm-prd-resource.gentlemonster.com/catalog/category/collections/image/e5dd0a6e-4772-4128-9ce0-42a83e985cf0/pc-plp-collection-h1.jpg' },
    { name: 'Maison Margiela', img: 'https://gm-prd-resource.gentlemonster.com/assets/stories/maisonMargiela2025/campaignImage-2-pc.jpg' },
  ];

  // Fetch data from the "collabs" table based on the selected filter
  useEffect(() => {
    const getCollabs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('collabs') // Pulling from your newly duplicated table
        .select('*')
        .contains('categories', [selectedCollab.toUpperCase()]); // Matching the uppercase tag style

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

      {/* Product Detail Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={addToCart}
      />

      <main className='flex-1 h-full overflow-y-auto pt-[60px] scroll-smooth'>

        {/* --- CIRCLE FILTER MENU --- */}
        <div className="w-full flex justify-center py-10 border-b border-neutral-100 bg-white sticky top-0 z-20">
          {/* Add pt-4 (padding top) to this container so the rings aren't cut off */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar px-10 items-start pt-4 pb-10">
            {collabFilters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedCollab(filter.name)}
                className="flex flex-col items-center flex-shrink-0 group outline-none"
              >
                <div
                  className={`w-[70px] h-[70px] lg:w-[65px] lg:h-[65px] rounded-full bg-neutral-200 bg-cover bg-center transition-all duration-500 ${selectedCollab === filter.name
                    ? 'ring-2 ring-black ring-offset-2 scale-105' // This ring needs space above it!
                    : 'group-hover:scale-105'
                    }`}
                  style={{ backgroundImage: `url(${filter.img})` }}
                />
                {/* Change w-20 to a smaller value like w-12 or w-16 to force wrapping */}
                <span className={`mt-4 text-[10px] uppercase tracking-tighter w-16 text-center leading-tight ...`}>
                  {filter.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="px-6 lg:px-12 py-10">
          <div className='flex items-center justify-between mb-10'>
            <h1 className='text-[12px] uppercase font-bold tracking-tight'>
              Collaborations / {selectedCollab}
            </h1>
            <span className='text-[11px] text-neutral-400 uppercase'>{items.length} Products Found</span>
          </div>

          {/* Reusing your ProductGrid Component */}
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