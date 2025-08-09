import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShoppingCart } from 'lucide-react-native';
import { useProducts } from '@/contexts/ProductContext';
import { Colors } from '@/constants/colors';

export default function BrandBrochureScreen() {
  const { name, categoryId } = useLocalSearchParams<{ name: string; categoryId?: string }>();
  const router = useRouter();
  const { products } = useProducts();

  // Filter products by brand and optionally by category
  const brandProducts = products.filter(product => {
    const matchesBrand = product.brand === name;
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    return matchesBrand && matchesCategory;
  });

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaText}>
            Select an ITEM and Click To View Item Details
          </Text>
        </View>

        <View style={styles.productsGrid}>
          {brandProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
            >
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                
                <View style={styles.priceContainer}>
                  {product.discountedPrice ? (
                    <>
                      <Text style={styles.originalPrice}>₹{product.price}</Text>
                      <Text style={styles.discountedPrice}>₹{product.discountedPrice}</Text>
                    </>
                  ) : (
                    <Text style={styles.price}>₹{product.price}</Text>
                  )}
                </View>

                {product.discountedPrice && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cartIconContainer}>
                <ShoppingCart size={16} color={Colors.teal} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {brandProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateText}>
              No products available for {name} in this category.
            </Text>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  ctaContainer: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.teal,
    textAlign: 'center',
  },
  productsGrid: {
    padding: 20,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.teal,
  },
  discountBadge: {
    backgroundColor: Colors.success,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
  },
  cartIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});