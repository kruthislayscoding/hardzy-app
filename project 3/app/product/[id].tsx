import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react-native';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Colors } from '@/constants/colors';
import { ProductVariant } from '@/types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById, checkInventory } = useProducts();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckingInventory, setIsCheckingInventory] = useState(false);
  const [inventoryAvailable, setInventoryAvailable] = useState<boolean | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = getProductById(id!);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const handleCheckInventory = async () => {
    setIsCheckingInventory(true);
    try {
      const available = await checkInventory(product.id, selectedVariant?.id);
      setInventoryAvailable(available);
    } catch (error) {
      Alert.alert('Error', 'Failed to check inventory');
    } finally {
      setIsCheckingInventory(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
  };

  const currentPrice = selectedVariant?.discountedPrice || selectedVariant?.price || product.discountedPrice || product.price;
  const originalPrice = selectedVariant?.price || product.price;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
            setSelectedImageIndex(index);
          }}
        >
          {product.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.productImage} />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.productDetails}>
          {/* Product Info */}
          <Text style={styles.brandName}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Variants */}
          {product.variants.length > 0 && (
            <View style={styles.variantsSection}>
              <Text style={styles.variantsTitle}>Available Sizes</Text>
              <View style={styles.variantsContainer}>
                {product.variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantChip,
                      selectedVariant?.id === variant.id && styles.selectedVariant,
                      !variant.inStock && styles.outOfStockVariant
                    ]}
                    onPress={() => variant.inStock && setSelectedVariant(variant)}
                    disabled={!variant.inStock}
                  >
                    <Text style={[
                      styles.variantText,
                      selectedVariant?.id === variant.id && styles.selectedVariantText,
                      !variant.inStock && styles.outOfStockVariantText
                    ]}>
                      {variant.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              {currentPrice !== originalPrice && (
                <Text style={styles.originalPrice}>₹{originalPrice}</Text>
              )}
              <Text style={styles.price}>₹{currentPrice}</Text>
            </View>
            
            {currentPrice !== originalPrice && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} color={Colors.teal} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={20} color={Colors.teal} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {inventoryAvailable === null ? (
          <TouchableOpacity
            style={styles.checkInventoryButton}
            onPress={handleCheckInventory}
            disabled={isCheckingInventory}
          >
            <Text style={styles.checkInventoryButtonText}>
              {isCheckingInventory ? 'Checking Inventory...' : 'Check Inventory'}
            </Text>
          </TouchableOpacity>
        ) : inventoryAvailable ? (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <ShoppingCart size={20} color={Colors.white} />
            <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.outOfStockButton}>
            <Text style={styles.outOfStockButtonText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: 400,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E1E5E9',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.teal,
  },
  productDetails: {
    padding: 20,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal,
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 30,
  },
  productDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  variantsSection: {
    marginBottom: 24,
  },
  variantsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  variantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    borderWidth: 2,
    borderColor: '#E1E5E9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedVariant: {
    borderColor: Colors.teal,
    backgroundColor: Colors.primaryLight,
  },
  outOfStockVariant: {
    borderColor: '#E1E5E9',
    backgroundColor: Colors.surface,
    opacity: 0.5,
  },
  variantText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedVariantText: {
    color: Colors.teal,
  },
  outOfStockVariantText: {
    color: Colors.textLight,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  discountBadge: {
    backgroundColor: Colors.success,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  checkInventoryButton: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkInventoryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  outOfStockButton: {
    backgroundColor: Colors.disabled,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  outOfStockButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});