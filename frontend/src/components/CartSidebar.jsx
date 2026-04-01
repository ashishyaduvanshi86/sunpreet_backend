import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Check, ArrowRight, Package, CreditCard, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceedToAddress = () => {
    setCheckoutStep('address');
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.city || !checkoutForm.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCheckoutStep('payment');
  };

  const initializeRazorpay = async () => {
    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer_name: checkoutForm.name,
        customer_email: checkoutForm.email,
        customer_phone: checkoutForm.phone,
        address: checkoutForm.address,
        city: checkoutForm.city,
        pincode: checkoutForm.pincode
      };

      const response = await axios.post(`${API}/orders/create`, orderPayload);
      const { razorpay_order_id, amount, key_id, order_id } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: "INR",
        name: "Sunpreet Singh's Coaching",
        description: "Equipment Purchase",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            await axios.post(`${API}/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order_id
            });
            
            setCheckoutStep('complete');
            clearCart();
            toast.success('Payment successful! Order confirmed.');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone
        },
        theme: {
          color: "#1C1917"
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'COD') {
      setIsSubmitting(true);
      try {
        const orderItems = cartItems.map(item => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`).join('\n');
        
        const payload = {
          first_name: checkoutForm.name,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          message: `NEW COD ORDER\n\n--- ORDER DETAILS ---\n${orderItems}\n\nTOTAL: ₹${cartTotal.toLocaleString()}\n\nPayment Method: Cash on Delivery\n\n--- DELIVERY ADDRESS ---\n${checkoutForm.address}\n${checkoutForm.city} - ${checkoutForm.pincode}\n\n--- CONTACT ---\nPhone: ${checkoutForm.phone}\nEmail: ${checkoutForm.email}`,
          preferred_date: null,
          preferred_time: null,
        };

        await axios.post(`${API}/contact`, payload);
        
        setCheckoutStep('complete');
        clearCart();
        toast.success('Order placed successfully!');
      } catch (error) {
        console.error('Error placing order:', error);
        toast.error('Failed to place order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      await initializeRazorpay();
    }
  };

  const resetCheckout = () => {
    setCheckoutStep('cart');
    setCheckoutForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
    setPaymentMethod('');
    onClose();
  };

  const getStepTitle = () => {
    switch (checkoutStep) {
      case 'cart': return 'Your Cart';
      case 'address': return 'Delivery Details';
      case 'payment': return 'Payment';
      case 'complete': return 'Order Complete';
      default: return 'Your Cart';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={resetCheckout}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FBFBF9] z-50 flex flex-col shadow-2xl"
            data-testid="cart-sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4]">
              <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">
                {getStepTitle()}
              </h2>
              <button onClick={resetCheckout} className="text-[#57534E] hover:text-[#1C1917]" data-testid="cart-close-btn">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            {checkoutStep !== 'complete' && cartItems.length > 0 && (
              <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                {['cart', 'address', 'payment'].map((step, idx) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      checkoutStep === step 
                        ? 'bg-[#1C1917] text-white' 
                        : ['cart', 'address', 'payment'].indexOf(checkoutStep) > idx 
                          ? 'bg-[#D6C0A6] text-[#1C1917]' 
                          : 'bg-[#E7E5E4] text-[#57534E]'
                    }`}>
                      {idx + 1}
                    </div>
                    {idx < 2 && <div className="w-12 md:w-16 h-0.5 bg-[#E7E5E4] mx-1" />}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {checkoutStep === 'complete' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-4">Order Received!</h3>
                  <p className="text-[#57534E] mb-2">
                    Thank you for your order!
                  </p>
                  <p className="text-[#57534E] mb-6 text-sm">
                    We've sent a confirmation to your email. You'll receive payment link on WhatsApp shortly.
                  </p>
                  <Button
                    onClick={resetCheckout}
                    className="bg-[#1C1917] text-[#FBFBF9] h-12 px-6 rounded-none"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : checkoutStep === 'payment' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-[#1C1917] mb-4">Select Payment Method</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setPaymentMethod('UPI')}
                        className={`w-full p-4 border flex items-center gap-4 transition-all ${
                          paymentMethod === 'UPI' ? 'border-[#1C1917] bg-[#F5F5F4]' : 'border-[#E7E5E4]'
                        }`}
                      >
                        <Smartphone className="w-6 h-6 text-[#1C1917]" />
                        <div className="text-left">
                          <p className="font-medium text-[#1C1917]">UPI Payment</p>
                          <p className="text-xs text-[#57534E]">Pay via GPay, PhonePe, Paytm</p>
                        </div>
                        {paymentMethod === 'UPI' && <Check className="w-5 h-5 text-green-600 ml-auto" />}
                      </button>
                      <button
                        onClick={() => setPaymentMethod('Card')}
                        className={`w-full p-4 border flex items-center gap-4 transition-all ${
                          paymentMethod === 'Card' ? 'border-[#1C1917] bg-[#F5F5F4]' : 'border-[#E7E5E4]'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 text-[#1C1917]" />
                        <div className="text-left">
                          <p className="font-medium text-[#1C1917]">Credit/Debit Card</p>
                          <p className="text-xs text-[#57534E]">Visa, Mastercard, RuPay</p>
                        </div>
                        {paymentMethod === 'Card' && <Check className="w-5 h-5 text-green-600 ml-auto" />}
                      </button>
                      <button
                        onClick={() => setPaymentMethod('COD')}
                        className={`w-full p-4 border flex items-center gap-4 transition-all ${
                          paymentMethod === 'COD' ? 'border-[#1C1917] bg-[#F5F5F4]' : 'border-[#E7E5E4]'
                        }`}
                      >
                        <Package className="w-6 h-6 text-[#1C1917]" />
                        <div className="text-left">
                          <p className="font-medium text-[#1C1917]">Cash on Delivery</p>
                          <p className="text-xs text-[#57534E]">Pay when you receive</p>
                        </div>
                        {paymentMethod === 'COD' && <Check className="w-5 h-5 text-green-600 ml-auto" />}
                      </button>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-[#F5F5F4] p-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-3">Order Summary</h4>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm mb-2">
                        <span className="text-[#57534E]">{item.name} x{item.quantity}</span>
                        <span className="text-[#1C1917]">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#E7E5E4] mt-3 pt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#57534E]">
                    {paymentMethod === 'COD' 
                      ? '* Additional ₹50 COD charges apply' 
                      : '* Payment link will be sent to your WhatsApp'}
                  </p>
                </div>
              ) : checkoutStep === 'address' ? (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none"
                      required
                      data-testid="checkout-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Email *</label>
                    <input
                      type="email"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none"
                      required
                      data-testid="checkout-email"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none"
                      placeholder="+91 98765 43210"
                      required
                      data-testid="checkout-phone"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">Delivery Address *</label>
                    <textarea
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none resize-none"
                      rows={3}
                      required
                      data-testid="checkout-address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">City *</label>
                      <input
                        type="text"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none"
                        required
                        data-testid="checkout-city"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2 block">PIN Code *</label>
                      <input
                        type="text"
                        value={checkoutForm.pincode}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, pincode: e.target.value }))}
                        className="w-full bg-white border border-[#E7E5E4] focus:border-[#1C1917] p-3 text-[#1C1917] focus:outline-none"
                        required
                        data-testid="checkout-pincode"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#1C1917] text-[#FBFBF9] h-14 rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all mt-4"
                    data-testid="proceed-payment-btn"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-[#E7E5E4] mx-auto mb-4" />
                  <p className="text-[#57534E]">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border border-[#E7E5E4]">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                      <div className="flex-1">
                        <h4 className="font-['Playfair_Display'] text-base text-[#1C1917]">{item.name}</h4>
                        <p className="text-[#57534E] text-sm">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-[#E7E5E4] flex items-center justify-center hover:border-[#1C1917]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[#1C1917] text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-[#E7E5E4] flex items-center justify-center hover:border-[#1C1917]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-[#A8A29E] hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-6 border-t border-[#E7E5E4]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#57534E]">Subtotal</span>
                  <span className="font-['Playfair_Display'] text-2xl text-[#1C1917]">₹{cartTotal.toLocaleString()}</span>
                </div>
                <Button
                  onClick={handleProceedToAddress}
                  className="w-full bg-[#1C1917] text-[#FBFBF9] h-14 rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all"
                  data-testid="proceed-checkout-btn"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
            {checkoutStep === 'payment' && (
              <div className="p-6 border-t border-[#E7E5E4]">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod || isSubmitting}
                  className="w-full bg-[#1C1917] text-[#FBFBF9] h-14 rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all disabled:opacity-50"
                  data-testid="place-order-btn"
                >
                  {isSubmitting ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
