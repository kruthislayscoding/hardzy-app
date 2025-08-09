import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

interface WhatsAppHelperProps {
  itemName?: string;
  quantity?: string;
  image?: string;
}

export default function WhatsAppHelper({ itemName, quantity, image }: WhatsAppHelperProps) {
  const { user } = useAuth();

  const handleWhatsAppPress = async () => {
    const address = user?.address 
      ? `${user.address.street}, ${user.address.city} - ${user.address.pincode}`
      : '';

    const message = `Hi, I'm interested in placing an order for:
- Item Name: ${itemName || '[ ]'}
- Quantity: ${quantity || '[ ]'}
- Address: ${address || '[ ]'}
${image ? '- Sample Image\n' : ''}
Please confirm availability and delivery time.`;

    const whatsappUrl = `whatsapp://send?phone=+919876543210&text=${encodeURIComponent(message)}`;
    const webWhatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webWhatsappUrl);
      }
      
      // Log support request (in real app, this would call a Cloud Function)
      console.log('WhatsApp support request logged:', {
        userId: user?.id,
        message,
        itemName,
        quantity,
        address,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to open WhatsApp. Please try again.');
    }
  };

  return (
    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
      <MessageCircle size={20} color={Colors.white} />
      <Text style={styles.whatsappText}>
        Can't find item? Click a picture, we will help
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  whatsappText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});