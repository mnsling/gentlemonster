import React, { useState, useEffect } from 'react'
import menu from '../assets/menu.svg'
import search from '../assets/search.svg'
import bag from '../assets/shopping-bag.svg'
import x from '../assets/x.svg'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {

  const [activeModal, setActiveModal] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const location = useLocation()

  // --- CART LOGIC ---
  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
  }

  useEffect(() => {
    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [])

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems]
    updatedCart.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    loadCart()
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0)
  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)

  // close everything on route change
  useEffect(() => {
    setActiveModal(null)
  }, [location.pathname])

  const toggleModal = (modal) => {
    setActiveModal(prev => prev === modal ? null : modal)
  }

  const closeAll = () => setActiveModal(null)

  return (
    <>
      {/* NAVBAR */}
      <div className='fixed w-full flex justify-between py-3 px-10 border-b border-slate-300 bg-white z-[250]'>

        <Link to='/' className='hidden lg:block font-playfair font-medium text-[20px] text-left'>
          GENTLE MONSTER
        </Link>

        {/* MOBILE MENU */}
        <button
          className='lg:hidden text-[14px]'
          onClick={() => toggleModal('menu')}
        >
          {activeModal === 'menu'
            ? <img src={x} alt="close menu" />
            : <img src={menu} alt="menu" />}
        </button>

        {/* DESKTOP MENU */}
        <div className='hidden lg:flex font-poppins text-[12px] gap-10 items-center'>
          <Link to="/events">EVENTS</Link>
          <Link to="/products">PRODUCTS</Link>
          <Link to="/collabs">COLLABORATIONS</Link>
          <Link to="/stores">STORES</Link>
        </div>

        <Link to='/' className='lg:hidden font-playfair font-medium text-[15px]'>
          GENTLE MONSTER
        </Link>

        {/* MOBILE ICONS */}
        <div className='flex gap-3 lg:hidden'>
          <button onClick={() => toggleModal('search')}>
            {activeModal === 'search'
              ? <img src={x} alt="close search" />
              : <img src={search} alt="search" />}
          </button>

          <button onClick={() => toggleModal('cart')} className="relative">
            <img src={bag} alt="cart" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className='hidden lg:flex font-poppins text-[12px] gap-10'>
          <button onClick={() => toggleModal('search')}>SEARCH</button>
          <button onClick={() => toggleModal('login')}>LOGIN</button>
          <button onClick={() => toggleModal('cart')}>CART ({totalQuantity})</button>
        </div>
      </div>

      {/* MENU MODAL */}
      {activeModal === 'menu' && (
        <div className='fixed inset-0 bg-white z-[240] flex flex-col justify-between pt-[60px] w-full font-poppins lg:hidden'>

          {/* 1. TOP/CENTER AREA: Navigation Links */}
          {/* Added 'flex-1' and 'justify-center' to vertically center these links */}
          <div className='flex-1 flex flex-col justify-center w-full font-extralight'>
            <Link to='/' onClick={closeAll} className='text-[24px] py-2 w-full px-[40px] border-b border-black hover:text-white hover:bg-black transition uppercase tracking-tighter'>HOME</Link>
            <Link to='/events' onClick={closeAll} className='text-[24px] py-2 w-full px-[40px] border-b border-black hover:text-white hover:bg-black transition uppercase tracking-tighter'>EVENTS</Link>
            <Link to='/products' onClick={closeAll} className='text-[24px] py-2 w-full px-[40px] border-b border-black hover:text-white hover:bg-black transition uppercase tracking-tighter'>PRODUCTS</Link>
            <Link to='/collabs' onClick={closeAll} className='text-[24px] py-2 w-full px-[40px] border-b border-black hover:text-white hover:bg-black transition uppercase tracking-tighter'>COLLABORATIONS</Link>
            <Link to='/stores' onClick={closeAll} className='text-[24px] py-2 w-full px-[40px] border-b border-black hover:text-white hover:bg-black transition uppercase tracking-tighter'>STORES</Link>
          </div>

          {/* 2. BOTTOM AREA: Login, Cart, and Time */}
          <div className='w-full pb-10 pt-6 border-t border-neutral-100'>
            <div className='flex justify-between items-center px-[40px]'>
              <div className='flex gap-8 text-[13px] font-medium tracking-tight'>
                <button onClick={() => toggleModal('login')} className="uppercase">LOGIN</button>
                <button onClick={() => toggleModal('cart')} className="uppercase">CART ({totalQuantity})</button>
              </div>

              {/* Real-time or Static Time */}
              <h1 className='text-[11px] text-[#949494] font-host'>TYO 06:01:38</h1>
            </div>
          </div>

        </div>
      )}

      {/* SEARCH MODAL */}
      <div className={`fixed top-[55px] left-0 w-full h-[calc(100vh-10px)] bg-white z-[300] flex flex-col items-center p-10 pt-16 transition-all duration-300 ease-in-out ${activeModal === 'search' ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className='flex flex-col w-[420px] lg:w-[520px] justify-center'>
          <div className='flex justify-end items-end mb-10'>
            <button onClick={closeAll} className='hidden lg:block'><img src={x} alt="close search" /></button>
          </div>
          <div className='flex gap-5 border-b border-black w-full pb-2 px-3 items-end justify-center'>
            <img src={search} alt="search icon" />
            <input type="text" placeholder="Please enter the search term(s)" className='w-full outline-none font-host text-[14px]' autoFocus={activeModal === 'search'} />
          </div>
          <div className='flex flex-col gap-12 mt-14'>
            <div className='flex flex-col gap-1'>
              <h1 className="font-host text-[14px] tracking-wide">SEARCH TRENDS</h1>
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="w-[70px] h-[70px] rounded-full bg-neutral-200 animate-pulse flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className='font-host text-[14px] flex justify-between'>
              <h1>RECENTLY VIEWED</h1>
              <button>CLEAR</button>
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      <div className={`fixed top-[55px] left-0 w-full h-[calc(100vh-10px)] bg-white z-[300] flex flex-col items-center p-10 pt-16 transition-all duration-300 ease-in-out ${activeModal === 'login' ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className='flex flex-col max-w-[520px] lg:w-[520px] justify-center'>
          <div className='flex justify-end mb-10'><button onClick={closeAll}><img src={x} alt="close login" /></button></div>
          <div className='flex flex-col gap-6 mb-10'>
            <h1 className='font-poppins font-extralight text-[20px] uppercase'>LOGIN / CREATE ACCOUNT</h1>
            <p className='font-poppins text-[12px]'>Please enter your email address, and we’ll check if you already have an account.</p>
          </div>
          <div className='flex flex-col justify-end'>
            <h1 className='text-right font-poppins text-[12px] mb-4'>Required Fields*</h1>
            <input type="email" placeholder="Email" className="border border-[#C7C7C7] rounded-md px-5 py-3 mb-4 outline-none text-[13px] font-host" />
            <input type="password" placeholder="Password" className="border border-[#C7C7C7] rounded-md px-5 py-3 mb-4 outline-none text-[13px] font-host" />
            <button className='text-[13px] bg-black text-white rounded-full font-host py-1'>CONTINUE</button>
            <h1 className='font-poppins text-center mt-6 text-[13px]'>OR</h1>
            <button className='border border-[#C7C7C7] rounded-md px-5 py-3 mt-6 text-[13px] font-host text-center hover:bg-black hover:text-white transition'>CONTINUE WITH GOOGLE</button>
          </div>
        </div>
      </div>

      {/* CART BACKDROP */}
      <div onClick={closeAll} className={`fixed top-[55px] left-0 w-full h-[calc(100vh-10px)] bg-black/40 backdrop-blur-sm z-[280] transition-opacity duration-500 ${activeModal === 'cart' ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

      {/* CART MODAL */}
      <div className={`fixed top-[55px] right-0 w-full lg:w-[480px] h-[calc(100vh-10px)] bg-white z-[300] flex flex-col p-10 pb-20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeModal === 'cart' ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
        <div className='h-full flex flex-col justify-between'>
          <div className='flex flex-col'>
            <div className="flex justify-between items-start mb-10">
              <h1 className="font-poppins font-extralight text-[20px] tracking-wide">CART</h1>
              <button onClick={closeAll}><img src={x} alt="close cart" /></button>
            </div>

            <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[55vh]">
              {cartItems.map((item, index) => (
                <div key={index} className='w-full h-[100px] bg-white border border-[#C7C7C7] flex rounded-sm overflow-hidden'>
                  <div className='w-[115px] h-full bg-neutral-200 bg-center bg-cover' style={{ backgroundImage: `url(${item.image_url})` }} />
                  <div className='w-full flex flex-col gap-2 justify-center font-poppins px-5'>
                    <div className='flex justify-between text-[14px] font-light uppercase'>
                      <h1 className="truncate mr-4">{item.name}</h1>
                      <h1 className="whitespace-nowrap">₱{Number(item.price).toLocaleString()}</h1>
                    </div>
                    <div className='flex justify-between text-[10px] font-extralight uppercase'>
                      <h1>Qty: {item.quantity}</h1>
                      <button onClick={() => removeFromCart(index)} className="underline hover:text-black">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && <p className="text-center font-poppins text-gray-400 mt-10 text-[12px]">Your cart is empty.</p>}
            </div>
          </div>

          <div className='flex flex-col gap-5 pt-5 border-t border-[#C7C7C7]'>
            <div className='flex justify-between font-host font-semibold text-[13px] uppercase'>
              <h1>Subtotal</h1>
              <h1>₱ {subtotal.toLocaleString()}</h1>
            </div>
            {/* CHECKOUT BUTTON: Opens the Checkout Modal */}
            <button
              onClick={() => toggleModal('checkout')}
              className='text-[13px] bg-black text-white rounded-full font-host py-1 uppercase mb-10 border hover:text-black hover:bg-white hover:border-black transition'
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* --- CHECKOUT MODAL (Login-style Layout) --- */}
      <div className={`fixed top-[55px] left-0 w-full h-[calc(100vh-10px)] bg-white z-[400] flex flex-col items-center p-10 pt-16 overflow-y-auto transition-all duration-300 ease-in-out ${activeModal === 'checkout' ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className='flex flex-col max-w-[520px] w-full justify-center'>

          {/* Header Actions */}
          <div className='flex justify-end items-center mb-10'>
            <button onClick={closeAll}><img src={x} alt="close checkout" /></button>
          </div>

          {/* Title Section */}
          <div className='flex flex-col gap-4 mb-10'>
            <h1 className='font-poppins font-extralight text-[20px] uppercase'>YOUR CART.</h1>
            <p className='font-poppins text-[12px] text-gray-500'>Please review your items before proceeding to payment.</p>
          </div>

          {/* Items List (Simplified for narrow view) */}
          <div className="flex flex-col gap-6 mb-10 max-h-[300px] overflow-y-auto no-scrollbar border-y border-neutral-100 py-6">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-50 flex-shrink-0">
                    <img src={item.image_url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-poppins text-[13px] uppercase truncate w-40">{item.name}</h2>
                    <p className="font-host text-[11px] text-gray-400">Qty: {item.quantity || 1}</p>
                  </div>
                </div>
                <p className="font-poppins text-[13px]">₱ {(Number(item.price) * (item.quantity || 1)).toLocaleString()}</p>
              </div>
            ))}
            {cartItems.length === 0 && <p className="text-center font-poppins text-[12px] text-gray-400 py-4">Your cart is empty.</p>}
          </div>

          {/* Summary & Action Section */}
          <div className='flex flex-col justify-end'>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between font-host text-[12px] text-gray-500 uppercase">
                <span>Subtotal</span>
                <span>₱ {subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between font-host text-[12px] text-gray-500 uppercase">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-poppins font-bold text-[16px] uppercase pt-3 border-t border-neutral-200">
                <span>Total</span>
                <span>₱ {subtotal.toLocaleString()}.00</span>
              </div>
            </div>

            <button className='text-[13px] bg-black text-white rounded-full font-host py-1 uppercase mb-10 border hover:text-black hover:bg-white hover:border-black transition'>
              CONFIRM AND PAY
            </button>

            <h1 className='font-poppins text-center mt-6 text-[11px] text-gray-400 uppercase tracking-widest'>Secure Checkout</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar