import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Share2, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

const PriceTrackerTool = () => {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [cart, setCart] = useState([]);
  const [customProduct, setCustomProduct] = useState({ name: '', price: '', supplier: '' });
  const [currency, setCurrency] = useState('USD');
  const [showMap, setShowMap] = useState(true);

  // Exchange rates (simplified for demo)
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
    NGN: 460,
    KES: 103,
    ZAR: 15.2
  };

  // Mock supplier data with locations
  const suppliers = {
    food: [
      { id: 1, name: "Fresh Valley Farms", location: "Downtown Market", lat: 40.7128, lng: -74.0060, phone: "+1234567890", products: [
        { name: "Rice (50kg)", price: 45, trend: 'up', change: 2.5 },
        { name: "Beans (25kg)", price: 32, trend: 'down', change: -1.2 },
        { name: "Cooking Oil (5L)", price: 18, trend: 'up', change: 0.8 }
      ]},
      { id: 2, name: "Golden Harvest Co.", location: "North Plaza", lat: 40.7589, lng: -73.9851, phone: "+1234567891", products: [
        { name: "Rice (50kg)", price: 42, trend: 'down', change: -1.5 },
        { name: "Beans (25kg)", price: 35, trend: 'up', change: 1.8 },
        { name: "Sugar (50kg)", price: 28, trend: 'stable', change: 0 }
      ]},
      { id: 3, name: "Metro Foods Ltd", location: "Central Station", lat: 40.7505, lng: -73.9934, phone: "+1234567892", products: [
        { name: "Cooking Oil (5L)", price: 16, trend: 'down', change: -2.1 },
        { name: "Flour (25kg)", price: 22, trend: 'up', change: 1.5 },
        { name: "Salt (10kg)", price: 8, trend: 'stable', change: 0 }
      ]}
    ],
    clothing: [
      { id: 4, name: "Fashion Forward", location: "Style District", lat: 40.7282, lng: -73.9942, phone: "+1234567893", products: [
        { name: "Cotton T-Shirts (dozen)", price: 85, trend: 'up', change: 3.2 },
        { name: "Jeans (per piece)", price: 25, trend: 'stable', change: 0 },
        { name: "Sneakers (pair)", price: 45, trend: 'down', change: -2.8 }
      ]},
      { id: 5, name: "Urban Threads", location: "Fashion Mall", lat: 40.7614, lng: -73.9776, phone: "+1234567894", products: [
        { name: "Cotton T-Shirts (dozen)", price: 78, trend: 'down', change: -1.5 },
        { name: "Dress Shirts (piece)", price: 35, trend: 'up', change: 2.1 },
        { name: "Casual Shoes (pair)", price: 38, trend: 'up', change: 1.9 }
      ]}
    ],
    electronics: [
      { id: 6, name: "Tech Solutions", location: "Electronics Hub", lat: 40.7831, lng: -73.9712, phone: "+1234567895", products: [
        { name: "Phone Cases (10 pack)", price: 45, trend: 'down', change: -3.2 },
        { name: "USB Cables (5 pack)", price: 22, trend: 'stable', change: 0 },
        { name: "Power Banks (piece)", price: 35, trend: 'up', change: 2.5 }
      ]},
      { id: 7, name: "Digital World", location: "Tech Plaza", lat: 40.7411, lng: -74.0012, phone: "+1234567896", products: [
        { name: "Headphones (piece)", price: 28, trend: 'up', change: 1.8 },
        { name: "Screen Protectors (10 pack)", price: 15, trend: 'down', change: -1.1 },
        { name: "Bluetooth Speakers", price: 55, trend: 'stable', change: 0 }
      ]}
    ]
  };

  const categories = {
    food: { name: 'Food & Groceries', color: 'bg-green-500', icon: '🍎' },
    clothing: { name: 'Clothing & Fashion', color: 'bg-purple-500', icon: '👕' },
    electronics: { name: 'Electronics', color: 'bg-blue-500', icon: '📱' }
  };

  const convertPrice = (price) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  const addToCart = (product, supplier) => {
    const cartItem = {
      id: Date.now(),
      ...product,
      supplier: supplier.name,
      supplierPhone: supplier.phone,
      originalPrice: product.price,
      convertedPrice: convertPrice(product.price)
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addCustomProduct = () => {
    if (customProduct.name && customProduct.price && customProduct.supplier) {
      const cartItem = {
        id: Date.now(),
        name: customProduct.name,
        price: parseFloat(customProduct.price),
        supplier: customProduct.supplier,
        supplierPhone: 'Custom Entry',
        originalPrice: parseFloat(customProduct.price),
        convertedPrice: convertPrice(parseFloat(customProduct.price)),
        trend: 'stable',
        change: 0
      };
      setCart([...cart, cartItem]);
      setCustomProduct({ name: '', price: '', supplier: '' });
    }
  };

  const shareToSocial = (platform) => {
    const cartSummary = cart.map(item => `${item.name}: ${item.convertedPrice} ${currency}`).join('\n');
    const message = `🛒 My Price Comparison:\n${cartSummary}\n\nTotal items: ${cart.length}\nUsing ShopSmart Price Tracker! 📊`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing with text
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const currentSuppliers = suppliers[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🛒 ShopSmart Price Tracker
          </h1>
          <p className="text-gray-600 text-lg">Compare prices, track suppliers, maximize profits!</p>
        </div>

        {/* Currency Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg">
            <label className="text-sm font-medium text-gray-700 mr-3">Currency:</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-purple-600"
            >
              {Object.keys(exchangeRates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 mr-2 last:mr-0 ${
                  selectedCategory === key 
                    ? `${category.color} text-white shadow-md transform scale-105` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Map/List View */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MapPin className="w-5 h-5 inline mr-2" />
            {showMap ? 'Show List View' : 'Show Map View'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Suppliers Section */}
          <div className="lg:col-span-2">
            {showMap ? (
              /* Map View */
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                  Supplier Locations
                </h2>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-xl font-semibold text-gray-700 mb-4">Interactive Supplier Map</p>
                      <div className="grid grid-cols-2 gap-4">
                        {currentSuppliers.map((supplier) => (
                          <div 
                            key={supplier.id}
                            onClick={() => setSelectedSupplier(supplier)}
                            className={`bg-white rounded-lg p-3 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                              selectedSupplier?.id === supplier.id ? 'ring-4 ring-purple-400' : ''
                            }`}
                          >
                            <div className="text-lg font-bold text-purple-600">📍</div>
                            <div className="text-sm font-semibold">{supplier.name}</div>
                            <div className="text-xs text-gray-500">{supplier.location}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {currentSuppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{supplier.name}</h3>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {supplier.location}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-1" />
                          {supplier.phone}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {supplier.products.map((product, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            {getTrendIcon(product.trend)}
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-2xl font-bold text-purple-600">
                                {convertPrice(product.price)} {currency}
                              </span>
                              {product.change !== 0 && (
                                <span className={`text-sm ml-2 ${product.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                                  ({product.change > 0 ? '+' : ''}{product.change}%)
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(product, supplier)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <Plus className="w-4 h-4 inline mr-1" />
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Product */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Plus className="w-6 h-6 mr-2 text-green-500" />
                Add Custom Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Product name"
                  value={customProduct.name}
                  onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={customProduct.price}
                  onChange={(e) => setCustomProduct({...customProduct, price: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Supplier name"
                  value={customProduct.supplier}
                  onChange={(e) => setCustomProduct({...customProduct, supplier: e.target.value})}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addCustomProduct}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Price Comparison Cart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-purple-500" />
              Price Comparison ({cart.length})
            </h3>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500">Add products to compare prices</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{item.supplier}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-600">
                          {item.convertedPrice} {currency}
                        </span>
                        {getTrendIcon(item.trend)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Sharing */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Comparison
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareToSocial('whatsapp')}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => shareToSocial('facebook')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Facebook className="w-4 h-4 mr-1" />
                      Facebook
                    </button>
                    <button
                      onClick={() => shareToSocial('instagram')}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <Instagram className="w-4 h-4 mr-1" />
                      IG
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total Items: {cart.length}</div>
                  <div className="text-lg font-bold text-purple-600">
                    Total Value: {cart.reduce((sum, item) => sum + parseFloat(item.convertedPrice), 0).toFixed(2)} {currency}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrackerTool;