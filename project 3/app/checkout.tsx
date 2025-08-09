import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Truck, Store, CreditCard, Banknote } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Colors } from '@/constants/colors';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  
  const deliveryCharge = deliveryOption === 'delivery' ? 50 : 0;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = () => {
    // Mock order placement
    Alert.alert(
      'Order Placed Successfully',
      'Your order has been placed and will be processed shortly.',
      [
        {
          text: 'Track Order',
          onPress: () => {
            clearCart();
            router.push('/orders/track/ORDER123');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please sign in to checkout</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.sectionSubtitle}>Is the address correct or change?</Text>
          
          <View style={styles.addressCard}>
            <MapPin size={20} color={Colors.teal} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>
                {user.address.street}
              </Text>
              <Text style={styles.addressText}>
                {user.address.city} - {user.address.pincode}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          
          <TouchableOpacity
            style={[styles.optionCard, deliveryOption === 'delivery' && styles.selectedOption]}
            onPress={() => setDeliveryOption('delivery')}
          >
            <Truck size={24} color={deliveryOption === 'delivery' ? Colors.teal : Colors.textSecondary} />
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, deliveryOption === 'delivery' && styles.selectedOptionText]}>
                Home Delivery
              </Text>
              <Text style={styles.optionSubtitle}>Delivered via Dunzo/Porter • ₹50</Text>
            </View>
            {deliveryOption === 'delivery' && <Check size={20} color={Colors.teal} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, deliveryOption === 'pickup' && styles.selectedOption]}
            onPress={() => setDeliveryOption('pickup')}
          >
            <Store size={24} color={deliveryOption === 'pickup' ? Colors.teal : Colors.textSecondary} />
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, deliveryOption === 'pickup' && styles.selectedOptionText]}>
                Pickup at Store
              </Text>
              <Text style={styles.optionSubtitle}>Free pickup • Ready in 2 hours</Text>
            </View>
            {deliveryOption === 'pickup' && <Check size={20} color={Colors.teal} />}
          </TouchableOpacity>
        </View>

        {/* Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[styles.optionCard, paymentMethod === 'razorpay' && styles.selectedOption]}
            onPress={() => setPaymentMethod('razorpay')}
          >
            <CreditCard size={24} color={paymentMethod === 'razorpay' ? Colors.teal : Colors.textSecondary} />
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, paymentMethod === 'razorpay' && styles.selectedOptionText]}>
                Online Payment
              </Text>
              <Text style={styles.optionSubtitle}>Pay using UPI, Card, or Net Banking</Text>
            </View>
            {paymentMethod === 'razorpay' && <Check size={20} color={Colors.teal} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, paymentMethod === 'cod' && styles.selectedOption]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Banknote size={24} color={paymentMethod === 'cod' ? Colors.teal : Colors.textSecondary} />
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, paymentMethod === 'cod' && styles.selectedOptionText]}>
                Cash on Delivery
              </Text>
              <Text style={styles.optionSubtitle}>Pay when you receive</Text>
            </View>
            {paymentMethod === 'cod' && <Check size={20} color={Colors.teal} />}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={styles.summaryValue}>
                {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'Free'}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order • ₹{total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.white,
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
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.teal,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: Colors.teal,
    backgroundColor: Colors.primaryLight,
  },
  optionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  selectedOptionText: {
    color: Colors.teal,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.teal,
  },
  bottomActions: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  placeOrderButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});