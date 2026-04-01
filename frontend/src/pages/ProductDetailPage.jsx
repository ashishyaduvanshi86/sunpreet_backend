import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Check, Package, ChevronRight, Truck, Shield, RotateCcw, Bell, Clock, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { products, getProductById } from '../data/products';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

function NotifyInline({ productId }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product_id: productId }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success(data.message);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-[#D6C0A6]/10 p-4 border border-[#D6C0A6]/30">
        <Check className="w-5 h-5 text-[#D6C0A6] flex-shrink-0" />
        <p className="text-sm text-[#44403C]">You're on the list! We'll email you when this product is available.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-testid="notify-inline-form">
      <p className="text-sm text-[#57534E]">Get notified when this product becomes available:</p>
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 h-12 px-4 border border-[#E7E5E4] bg-white text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors"
          data-testid="notify-inline-email"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 px-6 bg-[#D6C0A6] text-[#1C1917] text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all disabled:opacity-50"
          data-testid="notify-inline-submit"
        >
          <Bell className="w-4 h-4 mr-2" />
          {submitting ? '...' : 'Notify Me'}
        </Button>
      </div>
    </form>
  );
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const { addToCart, setIsCartOpen, cartCount } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products/stock`)
      .then(res => res.json())
      .then(data => {
        if (data[productId]) setStockInfo(data[productId]);
      })
      .catch(() => {});
  }, [productId]);

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#FBFBF9]">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#1C1917] mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button className="bg-[#1C1917] text-[#FBFBF9] rounded-none h-12 px-8 text-sm uppercase tracking-wider">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isComingSoon = stockInfo?.coming_soon ?? true;
  const isOutOfStock = !isComingSoon && stockInfo?.stock <= 0;
  const canBuy = !isComingSoon && !isOutOfStock;

  const handleAddToCart = () => {
    if (!canBuy) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, image: product.images[0] });
    }
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2500);
  };

  const otherProducts = products.filter(p => p.id !== product.id);

  return (
    <div className="pt-20 bg-[#FBFBF9] min-h-screen">
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1C1917] text-[#FBFBF9] w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all duration-300"
        data-testid="floating-cart-btn"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#D6C0A6] text-[#1C1917] w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium">{cartCount}</span>
        )}
      </button>

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-6">
        <nav className="flex items-center gap-2 text-sm text-[#A8A29E]" data-testid="product-breadcrumb">
          <Link to="/shop" className="hover:text-[#1C1917] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1C1917]">{product.name}</span>
        </nav>
      </div>

      {/* Product Main Section */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pb-20" data-testid="product-detail-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-4">
            <div className="aspect-square overflow-hidden bg-white border border-[#E7E5E4] relative" data-testid="product-main-image">
              <img src={product.images[selectedImage]} alt={product.name} className={`w-full h-full transition-opacity duration-300 ${product.imageStyle === 'contain' ? 'object-contain p-6' : 'object-cover'}`} />
              {isComingSoon && (
                <div className="absolute top-4 left-4 bg-[#1C1917] text-[#FBFBF9] px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />Coming Soon
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-[#78716C] text-white px-4 py-2 text-xs uppercase tracking-wider">Out of Stock</div>
              )}
            </div>
            <div className="flex gap-3" data-testid="product-thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx ? 'border-[#1C1917] opacity-100' : 'border-[#E7E5E4] opacity-60 hover:opacity-100'}`}
                  data-testid={`product-thumb-${idx}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D6C0A6] mb-2">{product.tagline}</p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#1C1917] mb-4" data-testid="product-detail-title">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#D6C0A6] text-[#D6C0A6]' : 'text-[#E7E5E4]'}`} />
                ))}
              </div>
              <span className="text-sm text-[#57534E]">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="mb-6">
              <span className="font-['Playfair_Display'] text-4xl text-[#1C1917]" data-testid="product-detail-price">{'\u20B9'}{product.price.toLocaleString()}</span>
              <span className="text-sm text-[#A8A29E] ml-2">incl. of all taxes</span>
            </div>

            <p className="text-[#57534E] leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#44403C] text-sm">
                    <div className="w-5 h-5 bg-[#D6C0A6]/20 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                      <Check className="w-3 h-3 text-[#D6C0A6]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status-dependent section */}
            {isComingSoon && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 bg-[#F5F5F4] p-4">
                  <Clock className="w-5 h-5 text-[#57534E]" />
                  <span className="text-sm text-[#57534E] font-medium">This product is launching soon</span>
                </div>
                <NotifyInline productId={product.id} />
              </div>
            )}

            {isOutOfStock && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 bg-[#FEE2E2] p-4">
                  <Package className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Currently out of stock</span>
                </div>
                <NotifyInline productId={product.id} />
              </div>
            )}

            {canBuy && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-[#E7E5E4]">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center text-[#1C1917] hover:bg-[#F5F5F4] transition-colors text-lg" data-testid="quantity-decrease">-</button>
                    <span className="w-11 h-11 flex items-center justify-center text-sm font-medium border-x border-[#E7E5E4]" data-testid="quantity-value">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(stockInfo?.stock || 20, q + 1))} className="w-11 h-11 flex items-center justify-center text-[#1C1917] hover:bg-[#F5F5F4] transition-colors text-lg" data-testid="quantity-increase">+</button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 text-sm uppercase tracking-[0.15em] rounded-none transition-all duration-300 ${
                      added ? 'bg-green-600 text-white' : 'bg-[#1C1917] text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917]'
                    }`}
                    data-testid="product-add-to-cart"
                  >
                    {added ? <><Check className="w-4 h-4 mr-2" />Added to Cart</> : <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>}
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-8">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">In Stock — {stockInfo?.stock} left</span>
                </div>
              </>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-[#E7E5E4] pt-6">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="w-5 h-5 text-[#57534E]" />
                <span className="text-[10px] uppercase tracking-wider text-[#57534E]">Free Shipping 3k+</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="w-5 h-5 text-[#57534E]" />
                <span className="text-[10px] uppercase tracking-wider text-[#57534E]">Quality Assured</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <RotateCcw className="w-5 h-5 text-[#57534E]" />
                <span className="text-[10px] uppercase tracking-wider text-[#57534E]">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="border-t border-[#E7E5E4] bg-white" data-testid="product-tabs-section">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex border-b border-[#E7E5E4]">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specifications', label: 'Specifications' },
              { key: 'uses', label: 'Uses' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-5 px-6 text-xs uppercase tracking-[0.2em] transition-colors relative ${activeTab === tab.key ? 'text-[#1C1917] font-medium' : 'text-[#A8A29E] hover:text-[#57534E]'}`}
                data-testid={`tab-${tab.key}`}
              >
                {tab.label}
                {activeTab === tab.key && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C1917]" />}
              </button>
            ))}
          </div>
          <div className="py-12">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                <p className="text-[#57534E] leading-relaxed text-sm">{product.longDescription}</p>
              </motion.div>
            )}
            {activeTab === 'specifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={key} className={`flex justify-between py-3 ${idx > 0 ? 'border-t border-[#E7E5E4]' : ''}`}>
                    <span className="text-sm text-[#57534E] font-medium">{key}</span>
                    <span className="text-sm text-[#44403C]">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}
            {activeTab === 'uses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                <p className="text-[#57534E] leading-relaxed text-sm">{product.uses}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="py-20 bg-[#F5F5F4]" data-testid="related-products">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-10 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProducts.map(p => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                onClick={() => { setSelectedImage(0); setActiveTab('description'); setQuantity(1); window.scrollTo(0, 0); }}
                className="group bg-white border border-[#E7E5E4] hover:border-[#D6C0A6] transition-all duration-500"
                data-testid={`related-${p.id}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-['Playfair_Display'] text-lg text-[#1C1917] mb-1 group-hover:text-[#D6C0A6] transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? 'fill-[#D6C0A6] text-[#D6C0A6]' : 'text-[#E7E5E4]'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#57534E]">({p.reviews})</span>
                  </div>
                  <span className="font-['Playfair_Display'] text-xl text-[#1C1917]">{'\u20B9'}{p.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
