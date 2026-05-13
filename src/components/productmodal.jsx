import React from 'react';
import Navbar from './navbar';

const ProductModal = ({ isOpen, product, onClose, onAddToCart }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white animate-in fade-in duration-500 overflow-y-auto lg:overflow-hidden flex flex-col">
      <Navbar />

      <div className="w-full h-full lg:flex lg:flex-row">
        {/* 1. IMAGE CONTAINER */}
        <div className="w-full h-[75vh] lg:w-[70%] lg:h-full bg-white flex flex-row overflow-x-auto flex-nowrap gap-2 scroll-smooth scrollbar-hide">
          {product.sub_images?.map((imgUrl, index) => (
            <div
              key={index}
              className="h-full w-full min-w-full lg:w-[50%] lg:min-w-[50%] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${imgUrl})` }}
            />
          ))}
        </div>

        {/* 2. DETAILS CONTAINER */}
        <div className="w-full h-auto lg:w-[30%] lg:h-full bg-white lg:border-l border-gray-100 p-8 lg:p-12 flex flex-col lg:justify-center mt-10">
          <button
            onClick={onClose}
            className="text-[11px] uppercase tracking-[0.2em] mb-10 text-left hover:opacity-50 transition"
          >
            ← BACK
          </button>

          <div className="mb-10 font-poppins">
            <h2 className="text-[28px] tracking-tighter leading-none mb-2 uppercase">
              {product.name}
            </h2>
            <p className="text-[16px] tracking-tight">
              ₱ {Number(product.price).toLocaleString()}
            </p>
          </div>

          <button 
            onClick={onAddToCart}
            className="text-[13px] bg-black text-white rounded-full font-host py-1 uppercase mb-10 border hover:text-black hover:bg-white hover:border-black transition"
          >
            Add to Cart
          </button>

          <div className="space-y-8">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Product Details</h4>
              <p className="text-[12px] text-gray-700 leading-relaxed font-light whitespace-pre-line">
                {product.description}
              </p>
            </div>
            <div className="pt-6 border-t border-gray-100 mb-10 lg:mb-0">
              <p className="text-[11px] text-gray-400 font-light italic">
                Not eligible for lens and fitting customization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;