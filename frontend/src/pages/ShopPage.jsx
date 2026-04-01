import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Check, ChevronLeft, ChevronRight, Package, Eye, Bell, Clock, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function NotifyModal({ product, isOpen, onClose }) {
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
        body: JSON.stringify({ email, product_id: product.id }),
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

  const handleClose = () => {
    setEmail('');
    setSubmitted(false);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
          data-testid="notify-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#FBFBF9] max-w-md w-full p-8 relative"
            onClick={e => e.stopPropagation()}
            data-testid="notify-modal-content"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#E7E5E4] flex items-center justify-center transition-colors"
              data-testid="notify-modal-close"
            >
              <X className="w-4 h-4 text-[#1C1917]" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-4 bg-[#D6C0A6]/20 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 text-[#D6C0A6]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-2">You're on the list!</h3>
                <p className="text-[#57534E] text-sm">We'll email you as soon as <strong>{product.name}</strong> is available.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-[#D6C0A6]" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917]">Get Notified</h3>
                </div>
                <p className="text-[#57534E] text-sm mb-6">
                  Enter your email and we'll let you know when <strong>{product.name}</strong> is available for purchase.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full h-12 px-4 border border-[#E7E5E4] bg-white text-[#1C1917] text-sm focus:outline-none focus:border-[#D6C0A6] transition-colors"
                    data-testid="notify-email-input"
                  />
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-[#1C1917] text-[#FBFBF9] text-sm uppercase tracking-[0.15em] rounded-none hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-all disabled:opacity-50"
                    data-testid="notify-submit-btn"
                  >
                    {submitting ? 'Submitting...' : 'Notify Me'}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductCard({ product, stockInfo, onQuickView, onNotify }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const isComingSoon = stockInfo?.coming_soon;
  const isOutOfStock = !isComingSoon && stockInfo?.stock <= 0;
  const canBuy = !isComingSoon && !isOutOfStock;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canBuy) return;
    addToCart({ ...product, image: product.images[0] });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleNotify = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onNotify(product);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onQuickView(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white border border-[#E7E5E4] hover:border-[#D6C0A6] transition-all duration-500 flex flex-col h-full"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/shop/${product.id}`} className={`relative aspect-square overflow-hidden block ${product.imageStyle === 'contain' ? 'bg-white' : ''}`}>
        <img
          src={product.images[currentImage]}
          alt={product.name}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${product.imageStyle === 'contain' ? 'object-contain p-4' : 'object-cover'}`}
        />
        {/* Badges */}
        {isComingSoon && (
          <div className="absolute top-4 left-4 bg-[#1C1917] text-[#FBFBF9] px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Coming Soon
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-4 left-4 bg-[#78716C] text-white px-3 py-1.5 text-xs uppercase tracking-wider">
            Out of Stock
          </div>
        )}
        {canBuy && product.badge && (
          <div className="absolute top-4 left-4 bg-[#D6C0A6] text-[#1C1917] px-3 py-1 text-xs uppercase tracking-wider font-medium">
            {product.badge}
          </div>
        )}
        {/* Quick View button */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-[#1C1917] px-5 py-2 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-2 hover:bg-white"
          data-testid={`quick-view-${product.id}`}
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>
        {/* Nav arrows */}
        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4" />
        </button>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/shop/${product.id}`} className="hover:text-[#D6C0A6] transition-colors">
          <h3 className="font-['Playfair_Display'] text-lg text-[#1C1917] mb-1 group-hover:text-[#D6C0A6] transition-colors" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[#A8A29E] mb-3">{product.tagline}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-[#D6C0A6] text-[#D6C0A6]' : 'text-[#E7E5E4]'}`} />
            ))}
          </div>
          <span className="text-xs text-[#57534E]">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-['Playfair_Display'] text-xl text-[#1C1917]">{'\u20B9'}{product.price.toLocaleString()}</span>
          {isComingSoon || isOutOfStock ? (
            <Button
              onClick={handleNotify}
              className="h-9 px-4 text-xs uppercase tracking-wider rounded-none bg-[#D6C0A6] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all duration-300"
              data-testid={`notify-btn-${product.id}`}
            >
              <Bell className="w-3.5 h-3.5 mr-1.5" />
              Notify Me
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              className={`h-9 px-4 text-xs uppercase tracking-wider rounded-none transition-all duration-300 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-[#1C1917] text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917]'
              }`}
              data-testid={`add-to-cart-${product.id}`}
            >
              {added ? <Check className="w-4 h-4" /> : 'Add'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, stockInfo, isOpen, onClose, onNotify }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const isComingSoon = stockInfo?.coming_soon;
  const isOutOfStock = !isComingSoon && stockInfo?.stock <= 0;
  const canBuy = !isComingSoon && !isOutOfStock;

  const handleAddToCart = () => {
    if (!canBuy) return;
    addToCart({ ...product, image: product.images[0] });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#FBFBF9] border-none rounded-none p-0 max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-square md:aspect-auto md:h-full">
              <img src={product.images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {isComingSoon && (
              <div className="absolute top-4 left-4 bg-[#1C1917] text-[#FBFBF9] px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3" />Coming Soon
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setCurrentImage(idx)} className={`w-12 h-12 border-2 overflow-hidden ${currentImage === idx ? 'border-[#1C1917]' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="p-8">
            <h2 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-2">{product.name}</h2>
            <p className="text-sm text-[#A8A29E] mb-4">{product.tagline}</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#D6C0A6] text-[#D6C0A6]' : 'text-[#E7E5E4]'}`} />
                ))}
              </div>
              <span className="text-sm text-[#57534E]">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <span className="font-['Playfair_Display'] text-3xl text-[#1C1917] block mb-6">{'\u20B9'}{product.price.toLocaleString()}</span>
            <p className="text-[#57534E] leading-relaxed mb-6">{product.description}</p>
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#57534E] mb-3">Features</h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#57534E] text-sm">
                    <Check className="w-4 h-4 text-[#D6C0A6] mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {isComingSoon && (
              <div className="flex items-center gap-2 mb-6 bg-[#F5F5F4] p-3">
                <Clock className="w-4 h-4 text-[#57534E]" />
                <span className="text-sm text-[#57534E]">This product is launching soon</span>
              </div>
            )}
            {isOutOfStock && (
              <div className="flex items-center gap-2 mb-6 bg-[#FEE2E2] p-3">
                <Package className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Currently out of stock</span>
              </div>
            )}
            {canBuy && (
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">In Stock ({stockInfo?.stock} left)</span>
              </div>
            )}
            <div className="flex gap-3">
              {canBuy ? (
                <Button
                  onClick={handleAddToCart}
                  className={`flex-1 h-14 text-sm uppercase tracking-[0.15em] rounded-none transition-all duration-300 ${
                    added ? 'bg-green-600 text-white' : 'bg-[#1C1917] text-[#FBFBF9] hover:bg-[#D6C0A6] hover:text-[#1C1917]'
                  }`}
                  data-testid="modal-add-to-cart"
                >
                  {added ? <><Check className="w-4 h-4 mr-2" />Added to Cart</> : <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>}
                </Button>
              ) : (
                <Button
                  onClick={() => { onClose(); onNotify(product); }}
                  className="flex-1 h-14 text-sm uppercase tracking-[0.15em] rounded-none bg-[#D6C0A6] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-all duration-300"
                  data-testid="modal-notify-btn"
                >
                  <Bell className="w-4 h-4 mr-2" />Notify Me When Available
                </Button>
              )}
              <Link to={`/shop/${product.id}`} onClick={onClose}>
                <Button variant="outline" className="h-14 px-6 text-sm uppercase tracking-[0.15em] rounded-none border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9]" data-testid="modal-view-details">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifyProduct, setNotifyProduct] = useState(null);
  const [stockData, setStockData] = useState({});
  const { setIsCartOpen, cartCount } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/products/stock`)
      .then(res => res.json())
      .then(data => setStockData(data))
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-[#1C1917]" data-testid="shop-hero">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/90358a1f-649a-4495-b3f9-6c9aea022b3c/images/ec84fe476893e07563a416d326bce3d35002563c9825c03cb32558b5170d4190.png"
            alt="Shop background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#D6C0A6] mb-4">Equipment</motion.p>
            <motion.h1 variants={fadeInUp} className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl text-[#FBFBF9] mb-6">Shop</motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-[#A8A29E] max-w-2xl mx-auto">
              Curated equipment for your movement practice. Quality tools to support your training journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

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

      {/* Products Grid */}
      <section className="py-24 md:py-32 bg-[#FBFBF9]" data-testid="products-grid">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#57534E] mb-4">Movement Essentials</motion.p>
            <motion.h2 variants={fadeInUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1917]">Our Products</motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stockInfo={stockData[product.id]}
                onQuickView={setSelectedProduct}
                onNotify={setNotifyProduct}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-[#A8A29E] text-sm mt-12 italic"
          >
            All products are currently in development. Final specifications, materials, and finish may vary.
          </motion.p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]" data-testid="shop-benefits">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Built for Athletes.', desc: 'Engineered with high-quality materials for strength, durability, and long-term performance.' },
              { title: 'Built. Packed. Delivered.', desc: 'Free shipping on orders above \u20B93,000. Arrives within 7\u20138 business days.' },
              { title: 'We\u2019ve Got You Covered.', desc: 'Have questions or issues? Our team is here to support you every step of the way.' },
            ].map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="text-center">
                <div className="w-12 h-12 mx-auto mb-6 border border-[#1C1917] flex items-center justify-center">
                  <span className="font-['Playfair_Display'] text-xl text-[#1C1917]">{index + 1}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mb-3">{item.title}</h3>
                <p className="text-[#57534E] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        stockInfo={selectedProduct ? stockData[selectedProduct.id] : null}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNotify={setNotifyProduct}
      />

      {/* Notify Me Modal */}
      <NotifyModal
        product={notifyProduct}
        isOpen={!!notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />
    </div>
  );
}
