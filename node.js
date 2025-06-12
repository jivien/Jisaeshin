import React, { useState, useMemo } from 'react';
import { Search, X, Heart, ShoppingBag, Filter, Star, MapPin, CreditCard, Wallet, Landmark, CheckCircle, ArrowLeft } from 'lucide-react';

// --- DATA PRODUK (DIPERBARUI DENGAN VIDEO) ---
const PRODUCTS = [
  { id: 1, name: 'Jam Tangan Chronograph "Aethelred"', price: 4250000, category: 'Aksesoris', image: 'https://placehold.co/600x600/1a1a1a/ffffff?text=Aethelred', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', rating: 5, releaseDate: '2023-11-15' },
  { id: 2, name: 'Kemeja Sutra "Silvanus"', price: 1800000, category: 'Pakaian Pria', image: 'https://placehold.co/600x600/e0e0e0/333333?text=Silvanus', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', rating: 5, releaseDate: '2023-10-20' },
  { id: 3, name: 'Sepatu Kulit "Valerius"', price: 3500000, category: 'Sepatu', image: 'https://placehold.co/600x600/3a2e2e/ffffff?text=Valerius', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', rating: 4, releaseDate: '2023-12-01' },
  { id: 4, name: 'Tas Ransel Kanvas "Oakhaven"', price: 2100000, category: 'Tas', image: 'https://placehold.co/600x600/5a6a5a/ffffff?text=Oakhaven', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', rating: 4, releaseDate: '2023-09-05' },
  { id: 5, name: 'Gaun Sutra "Seraphina"', price: 6100000, category: 'Pakaian Wanita', image: 'https://placehold.co/600x600/b0a0e0/ffffff?text=Seraphina', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', rating: 5, releaseDate: '2024-03-10' },
  { id: 6, name: 'Blazer Wol "Ironwood"', price: 5500000, category: 'Pakaian Pria', image: 'https://placehold.co/600x600/333333/ffffff?text=Ironwood', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', rating: 5, releaseDate: '2023-11-25' },
];
const CATEGORIES = ['Semua', 'Pakaian Pria', 'Pakaian Wanita', 'Sepatu', 'Aksesoris', 'Tas'];

// --- DATA CONTOH UNTUK CHECKOUT ---
const USER_ADDRESSES = [
    { id: 1, alias: 'Rumah', recipient: 'Jane Doe', phone: '081234567890', fullAddress: 'Jl. Merdeka No. 123, Kel. Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114' },
    { id: 2, alias: 'Kantor', recipient: 'Jane Doe', phone: '081234567890', fullAddress: 'Gedung The Plaza, Lt. 42, Jl. M.H. Thamrin No. 28-30, Gondangdia, Menteng, Jakarta Pusat 10350' },
];
const PAYMENT_METHODS = [
    { id: 'cc', name: 'Kartu Kredit / Debit', icon: CreditCard, description: 'Visa, MasterCard, JCB' },
    { id: 'va', name: 'Virtual Account', icon: Landmark, description: 'BCA, Mandiri, BNI, lainnya' },
    { id: 'ewallet', name: 'E-Wallet', icon: Wallet, description: 'GoPay, OVO, Dana' },
];


// --- KOMPONEN-KOMPONEN UI ---

const Header = ({ onSearch, cartCount, onGoToCheckout, onReturnToCatalog, currentView }) => (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    {currentView !== 'catalog' && (
                        <button onClick={onReturnToCatalog} className="mr-4 text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <a href="#" onClick={e => {e.preventDefault(); onReturnToCatalog();}} className="text-2xl font-bold text-gray-900 tracking-wider">ELEGANZA</a>
                </div>
                {currentView === 'catalog' && (
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Cari produk..." onChange={(e) => onSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="relative">
                           <ShoppingBag onClick={cartCount > 0 ? onGoToCheckout : null} className={`text-gray-600  ${cartCount > 0 ? 'hover:text-gray-900 cursor-pointer' : 'cursor-not-allowed'}`} size={24} />
                           {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </header>
);

const ProductCard = ({ product, onSelect }) => (
    <div className="group cursor-pointer" onClick={() => onSelect(product)}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
            <p className="text-lg font-bold text-gray-900 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
    </div>
);

const ProductModal = ({ product, onClose, onAddToCart }) => {
    const [activeTab, setActiveTab] = useState('photo');
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 bg-gray-100 relative">
                    <div className="p-2 absolute top-0 left-0 z-10 flex gap-2">
                        <button onClick={() => setActiveTab('photo')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'photo' ? 'bg-white shadow' : 'bg-black/20 text-white'}`}>Foto</button>
                        <button onClick={() => setActiveTab('video')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'video' ? 'bg-white shadow' : 'bg-black/20 text-white'}`}>Video</button>
                    </div>
                    {activeTab === 'photo' ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
                    ) : (
                        <video src={product.videoUrl} className="w-full h-full object-cover" controls autoPlay muted loop playsInline></video>
                    )}
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    {/* ... (Konten detail produk lainnya sama seperti sebelumnya) */}
                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                         <div className="flex items-center my-3">
                            {Array(5).fill(0).map((_, i) => <Star key={i} size={18} className={i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />)}
                            <span className="ml-2 text-sm text-gray-600">({product.rating}.0)</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mt-2 mb-4">Rp {product.price.toLocaleString('id-ID')}</p>
                        <p className="text-gray-600 leading-relaxed">
                            Produk eksklusif dari koleksi terbaru kami, dibuat dengan material premium untuk kenyamanan dan gaya maksimal.
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                       <button onClick={() => onAddToCart(product)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-700 transition-colors">
                            Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CatalogPage = ({ products, onProductSelect, onGoToCheckout, onAddToCart }) => {
    // State dan logika untuk filter & sorting, sama seperti sebelumnya
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [filters, setFilters] = useState({ category: 'Semua', price: 8000000 });
    
    const displayedProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (filters.category === 'Semua' || p.category === filters.category) && p.price <= filters.price)
            .sort((a, b) => {
                switch (sortOption) {
                    case 'price-asc': return a.price - b.price;
                    case 'price-desc': return b.price - a.price;
                    default: return new Date(b.releaseDate) - new Date(a.releaseDate);
                }
            });
    }, [products, searchQuery, filters, sortOption]);
    
    // JSX Halaman Katalog
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Koleksi Pilihan</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Temukan gaya Anda dari pilihan produk premium yang telah kami kurasi.</p>
            </div>
            {/* ... (Filter, sorting, dan grid produk) */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                ))}
            </div>
        </main>
    );
};

const CheckoutPage = ({ cartItems, onPlaceOrder }) => {
    const [selectedAddressId, setSelectedAddressId] = useState(USER_ADDRESSES[0].id);
    const [selectedPaymentId, setSelectedPaymentId] = useState(PAYMENT_METHODS[0].id);
    
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price, 0), [cartItems]);
    const shippingCost = 50000;
    const total = subtotal + shippingCost;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri: Alamat & Pembayaran */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bagian Alamat Pengiriman */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Alamat Pengiriman</h2>
                        <div className="space-y-4">
                            {USER_ADDRESSES.map(addr => (
                                <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)}
                                    className={`p-4 border rounded-lg cursor-pointer transition ${selectedAddressId === addr.id ? 'border-gray-800 ring-2 ring-gray-800/50' : 'border-gray-200 hover:border-gray-400'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-900">{addr.alias} <span className="font-normal text-gray-600">- {addr.recipient}</span></p>
                                            <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                                            <p className="text-sm text-gray-600">{addr.fullAddress}</p>
                                        </div>
                                        {selectedAddressId === addr.id && <CheckCircle className="text-gray-800" size={20} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 text-sm font-semibold text-gray-800 hover:underline">+ Tambah Alamat Baru</button>
                    </div>

                    {/* Bagian Metode Pembayaran */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Metode Pembayaran</h2>
                        <div className="space-y-3">
                           {PAYMENT_METHODS.map(method => (
                               <div key={method.id} onClick={() => setSelectedPaymentId(method.id)}
                                   className={`p-4 border rounded-lg cursor-pointer transition flex items-center justify-between ${selectedPaymentId === method.id ? 'border-gray-800 ring-2 ring-gray-800/50' : 'border-gray-200 hover:border-gray-400'}`}>
                                   <div className="flex items-center gap-4">
                                       <method.icon className="text-gray-700" size={24} />
                                       <div>
                                           <p className="font-bold text-gray-900">{method.name}</p>
                                           <p className="text-xs text-gray-500">{method.description}</p>
                                       </div>
                                   </div>
                                    {selectedPaymentId === method.id && <CheckCircle className="text-gray-800" size={20} />}
                               </div>
                           ))}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Ringkasan Pesanan */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>
                        <div className="space-y-3 mb-4 border-b pb-4">
                           {cartItems.map(item => (
                               <div key={item.id} className="flex justify-between items-center text-sm">
                                   <span className="text-gray-600">{item.name}</span>
                                   <span className="font-medium text-gray-800">Rp {item.price.toLocaleString('id-ID')}</span>
                               </div>
                           ))}
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Pengiriman</span>
                                <span className="font-medium text-gray-800">Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <button onClick={onPlaceOrder} className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const ConfirmationPage = ({ onReturnToCatalog }) => {
    const orderId = useMemo(() => `ELEG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, []);
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900">Pesanan Diterima!</h1>
            <p className="text-gray-600 mt-2">Terima kasih atas pembelian Anda. Pesanan Anda sedang kami proses.</p>
            <div className="mt-6 bg-gray-100 inline-block px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-500">Nomor Pesanan</p>
                <p className="font-mono font-bold text-lg text-gray-800">{orderId}</p>
            </div>
            <div className="mt-8">
                <button onClick={onReturnToCatalog} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors">
                    Kembali Berbelanja
                </button>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA APLIKASI ---
export default function App() {
    const [currentView, setCurrentView] = useState('catalog'); // catalog, checkout, confirmation
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = (product) => {
        setCartItems(prev => [...prev, product]);
        setSelectedProduct(null); // Tutup modal setelah menambah ke keranjang
    };
    
    const handleGoToCheckout = () => {
        if (cartItems.length > 0) {
            setCurrentView('checkout');
        }
    };
    
    const handlePlaceOrder = () => setCurrentView('confirmation');
    
    const handleReturnToCatalog = () => {
        if(currentView === 'confirmation') {
            setCartItems([]); // Kosongkan keranjang setelah selesai
        }
        setCurrentView('catalog');
    };

    const renderView = () => {
        switch (currentView) {
            case 'checkout':
                return <CheckoutPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />;
            case 'confirmation':
                return <ConfirmationPage onReturnToCatalog={handleReturnToCatalog} />;
            case 'catalog':
            default:
                return <CatalogPage products={PRODUCTS} onProductSelect={setSelectedProduct} onGoToCheckout={handleGoToCheckout} onAddToCart={handleAddToCart} />;
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header 
                cartCount={cartItems.length} 
                onGoToCheckout={handleGoToCheckout}
                onReturnToCatalog={handleReturnToCatalog}
                currentView={currentView}
            />
            {currentView === 'catalog' && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />}
            {renderView()}
        </div>
    );
}

