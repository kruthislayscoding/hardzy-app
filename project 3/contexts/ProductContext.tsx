import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Category } from '@/types';
import { CATEGORIES } from '@/constants/categories';

interface ProductContextType {
  categories: Category[];
  products: Product[];
  selectedCategory: Category | null;
  selectedBrand: string | null;
  searchQuery: string;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  setSearchQuery: (query: string) => void;
  getProductsByCategory: (categoryId: string, brandName?: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  checkInventory: (productId: string, variantId?: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'BOSCH Professional Drill Machine',
    description: 'Heavy-duty drill machine for professional use with variable speed control and hammer function.',
    images: [
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    price: 8500,
    discountedPrice: 7200,
    brand: 'BOSCH',
    categoryId: 'tools',
    subcategoryId: 'power-tools',
    variants: [
      { id: 'v1', name: '13mm', price: 7200, inStock: true },
      { id: 'v2', name: '16mm', price: 8500, inStock: true }
    ],
    inStock: true,
    stockQuantity: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'CERA Bathroom Faucet Set',
    description: 'Premium bathroom faucet set with modern design and chrome finish.',
    images: [
      'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    price: 4500,
    discountedPrice: 3800,
    brand: 'CERA',
    categoryId: 'sanitary-plumbing',
    subcategoryId: 'bathroom',
    variants: [
      { id: 'v1', name: 'Chrome', price: 3800, inStock: true },
      { id: 'v2', name: 'Matt Black', price: 4200, inStock: false }
    ],
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'ASIAN PAINTS Royale Interior Paint',
    description: 'Premium interior emulsion paint with silk finish and excellent coverage.',
    images: [
      'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    price: 2800,
    discountedPrice: 2400,
    brand: 'ASIAN PAINTS',
    categoryId: 'paint',
    subcategoryId: 'interior',
    variants: [
      { id: 'v1', name: '10L', price: 2400, inStock: true },
      { id: 'v2', name: '20L', price: 4600, inStock: true }
    ],
    inStock: true,
    stockQuantity: 30,
    createdAt: new Date().toISOString()
  }
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<Category[]>(CATEGORIES);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getProductsByCategory = (categoryId: string, brandName?: string) => {
    return products.filter(product => {
      const matchesCategory = product.categoryId === categoryId;
      const matchesBrand = !brandName || product.brand === brandName;
      return matchesCategory && matchesBrand;
    });
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const checkInventory = async (productId: string, variantId?: string): Promise<boolean> => {
    // Mock inventory check - in real app, this would query Firestore
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const product = getProductById(productId);
    if (!product) return false;
    
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      return variant?.inStock || false;
    }
    
    return product.inStock;
  };

  return (
    <ProductContext.Provider value={{
      categories,
      products,
      selectedCategory,
      selectedBrand,
      searchQuery,
      setSelectedCategory,
      setSelectedBrand,
      setSearchQuery,
      getProductsByCategory,
      getProductById,
      checkInventory
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};