export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  profileComplete: boolean;
  address: {
    street: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  categoryId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  discountedPrice?: number;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  variants: ProductVariant[];
  inStock: boolean;
  stockQuantity: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    pincode: string;
  };
  deliveryOption: 'delivery' | 'pickup';
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryPartnerId?: string;
  trackingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportRequest {
  id: string;
  userId: string;
  message: string;
  itemName?: string;
  quantity?: string;
  address?: string;
  image?: string;
  createdAt: string;
}