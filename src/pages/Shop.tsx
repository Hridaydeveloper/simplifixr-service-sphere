
import { useState } from "react";
import { Search, Filter, ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electrical', name: 'Electrical Tools' },
    { id: 'plumbing', name: 'Plumbing Tools' },
    { id: 'cleaning', name: 'Car Cleaning' },
    { id: 'safety', name: 'Safety Equipment' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Professional Electric Drill Set',
      price: 2999,
      originalPrice: 3999,
      rating: 4.5,
      reviews: 234,
      image: '/placeholder.svg',
      category: 'electrical',
      inStock: true,
      description: 'Heavy-duty electric drill with multiple bits'
    },
    {
      id: '2',
      name: 'Pipe Wrench Tool Set',
      price: 1599,
      rating: 4.3,
      reviews: 156,
      image: '/placeholder.svg',
      category: 'plumbing',
      inStock: true,
      description: 'Complete pipe wrench set for all plumbing needs'
    },
    {
      id: '3',
      name: 'Car Cleaning Kit',
      price: 899,
      originalPrice: 1299,
      rating: 4.7,
      reviews: 342,
      image: '/placeholder.svg',
      category: 'cleaning',
      inStock: true,
      description: 'Complete car cleaning kit with microfiber cloths'
    },
    {
      id: '4',
      name: 'Safety Helmet & Gloves',
      price: 799,
      rating: 4.4,
      reviews: 89,
      image: '/placeholder.svg',
      category: 'safety',
      inStock: true,
      description: 'Professional safety gear for construction work'
    },
    {
      id: '5',
      name: 'Multimeter Digital',
      price: 1299,
      rating: 4.6,
      reviews: 198,
      image: '/placeholder.svg',
      category: 'electrical',
      inStock: false,
      description: 'Digital multimeter for electrical measurements'
    },
    {
      id: '6',
      name: 'Tool Storage Box',
      price: 2199,
      rating: 4.2,
      reviews: 76,
      image: '/placeholder.svg',
      category: 'accessories',
      inStock: true,
      description: 'Large capacity tool storage with multiple compartments'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Tools & Accessories
            </h1>
            <p className="text-gray-600">
              Quality tools and accessories for electrical, plumbing, and car cleaning services
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search tools and accessories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-[#00B896] hover:bg-[#00A085]" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg bg-gray-100"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-2"
                    >
                      <Heart 
                        className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                      />
                    </Button>
                    {!product.inStock && (
                      <Badge variant="destructive" className="absolute bottom-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge className="absolute bottom-2 right-2 bg-green-500">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock || cart.includes(product.id)}
                    className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {cart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
