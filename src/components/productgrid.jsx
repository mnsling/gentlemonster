import React from 'react';

const ProductCard = ({ item, onClick }) => (
  <div onClick={() => onClick(item)} className="group cursor-pointer">
    <div className="bg-[#F2F2F2] aspect-[4/5] flex items-center justify-center overflow-hidden mb-4">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-full object-contain scale-150 transition-transform duration-700 group-hover:scale-[1.6]"
      />
    </div>
    <div className="space-y-0.5">
      <h2 className="text-[12px] uppercase font-normal tracking-tight">{item.name}</h2>
      <p className="text-[12px] font-medium">₱ {Number(item.price).toLocaleString()}</p>
      {item.variants && <p className="text-[11px] text-gray-400">{item.variants}</p>}
    </div>
  </div>
);

const ProductGrid = ({ items, onProductClick, loading }) => {
  if (loading) {
    return <div className="h-64 flex items-center justify-center text-[11px] tracking-widest uppercase">Loading...</div>;
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-16 pb-32'>
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductGrid;