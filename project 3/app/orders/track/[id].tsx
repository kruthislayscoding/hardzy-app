import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Package, Truck, CircleCheck as CheckCircle, Download, ExternalLink } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function TrackOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock order data
  const order = {
    id: id || 'ORDER123',
    status: 'out_for_delivery',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    deliveryPartner: 'Dunzo',
    trackingUrl: 'https://track.dunzo.com/ORDER123'
  };

  const statusSteps = [
    { id: 'placed', title: 'Order Placed', subtitle: 'Your order has been received', completed: true },
    { id: 'confirmed', title: 'Order Confirmed', subtitle: 'We are preparing your order', completed: true },
    { id: 'out_for_delivery', title: 'Out for Delivery', subtitle: 'Your order is on the way', completed: true },
    { id: 'delivered', title: 'Delivered', subtitle: 'Order delivered successfully', completed: false }
  ];

  const handleDownloadInvoice = () => {
    Alert.alert('Invoice', 'Invoice download functionality will be implemented with actual backend');
  };

  const handleTrackWithPartner = () => {
    if (order.trackingUrl) {
      Linking.openURL(order.trackingUrl);
    }
  };

  const getStatusIcon = (stepId: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle size={24} color={Colors.success} />;
    }
    
    switch (stepId) {
      case 'placed':
        return <Package size={24} color={Colors.textLight} />;
      case 'confirmed':
        return <CheckCircle size={24} color={Colors.textLight} />;
      case 'out_for_delivery':
        return <Truck size={24} color={Colors.textLight} />;
      case 'delivered':
        return <CheckCircle size={24} color={Colors.textLight} />;
      default:
        return <Package size={24} color={Colors.textLight} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.orderInfoCard}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.estimatedDelivery}>
            Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()} at {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Order Status Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Order Status</Text>
          
          <View style={styles.timeline}>
            {statusSteps.map((step, index) => (
              <View key={step.id} style={styles.timelineStep}>
                <View style={styles.timelineIconContainer}>
                  {getStatusIcon(step.id, step.completed)}
                  {index < statusSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      step.completed && styles.completedLine
                    ]} />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineStepTitle,
                    step.completed && styles.completedStepTitle
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.timelineStepSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadInvoice}>
            <Download size={20} color={Colors.teal} />
            <Text style={styles.actionButtonText}>Download Invoice</Text>
          </TouchableOpacity>

          {order.trackingUrl && (
            <TouchableOpacity style={styles.actionButton} onPress={handleTrackWithPartner}>
              <ExternalLink size={20} color={Colors.teal} />
              <Text style={styles.actionButtonText}>Track with {order.deliveryPartner}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    padding: 20,
  },
  orderInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  estimatedDelivery: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal,
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  timeline: {
    paddingLeft: 12,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E1E5E9',
    marginTop: 8,
  },
  completedLine: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  completedStepTitle: {
    color: Colors.text,
  },
  timelineStepSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.teal,
    marginLeft: 12,
  },
});