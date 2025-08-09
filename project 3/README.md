# Hardzy - Hardware Delivery Mobile App

A React Native (Expo) mobile application for hardware delivery, built for students to learn modern mobile app development with Firebase backend.

## 🎯 Project Overview

Hardzy is a hardware delivery app similar to Zepto, specifically designed for construction materials, tools, and hardware supplies. The app provides a complete user journey from product discovery to delivery tracking.

## 🚀 Features

### User Features
- **Authentication**: Phone OTP verification with Firebase Auth
- **Profile Management**: Complete user profile with address details
- **Product Catalog**: Browse by categories and brands
- **Search**: Advanced product search functionality
- **Shopping Cart**: Add, remove, and manage items
- **Checkout**: Multiple delivery and payment options
- **Order Tracking**: Real-time order status with delivery partner integration
- **WhatsApp Support**: Integrated customer support

### Admin Features (Future Implementation)
- Product management (CRUD operations)
- Order management and tracking
- Inventory management
- Analytics dashboard
- Customer support management

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: React Context API
- **UI Components**: Custom Material Design 3 inspired components
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Payments**: Razorpay integration (setup required)
- **Delivery**: Dunzo/Porter API integration (mocked for development)

## 🎨 Design System

### Color Tokens
- White: `#FFFFFF`
- Teal (Primary): `#00BFA6`
- Blue (Secondary): `#007BFF`
- Black (Text): `#000000`

### Typography
- Headers: Bold, 20-28px
- Body: Regular, 14-16px
- Captions: 12-14px

## 📱 User Flow

1. **Splash Screen** → **Authentication** (Phone OTP)
2. **Profile Creation** → **Welcome Message**
3. **Home Screen** → **Categories** → **Brand Brochure**
4. **Product Details** → **Cart** → **Checkout**
5. **Payment** → **Order Confirmation** → **Order Tracking**

## 🏗 Project Structure

```
/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab-based navigation
│   ├── category/          # Category screens
│   ├── product/           # Product detail screens
│   ├── orders/            # Order tracking screens
│   └── auth.tsx           # Authentication flow
├── components/            # Reusable components
├── contexts/             # React Context providers
├── constants/            # App constants and configuration
├── types/               # TypeScript type definitions
└── hooks/               # Custom hooks
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open on Device/Emulator**
   - Scan QR code with Expo Go app
   - Or press 'a' for Android emulator, 'i' for iOS simulator

### Firebase Setup (Required for Full Functionality)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Enable Phone authentication
   - Disable email verification for development

3. **Set Up Firestore**
   - Create collections: `users`, `products`, `categories`, `orders`, `carts`
   - Configure security rules (see `firestore.rules`)

4. **Add Firebase Config**
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Add to respective platform directories

### Payment Integration (Razorpay)

1. **Create Razorpay Account**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Get test API keys

2. **Configure Environment Variables**
   ```bash
   EXPO_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
   ```

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  profileComplete: boolean;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  discountedPrice?: number;
  variants: ProductVariant[];
  inStock: boolean;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryOption: 'delivery' | 'pickup';
  paymentMethod: 'razorpay' | 'cod';
}
```

## 🧪 Testing

### Mock Data
The app includes comprehensive mock data for:
- Product catalog with categories and brands
- User authentication flow
- Order placement and tracking
- Inventory management

### Test Scenarios
1. **User Registration**: Complete OTP flow and profile creation
2. **Product Discovery**: Browse categories and search for products
3. **Shopping Flow**: Add to cart, checkout, and place order
4. **Order Tracking**: Monitor order status and delivery updates

## 🚀 Deployment

### Mobile App
```bash
# Build for production
expo build:android
expo build:ios
```

### Firebase Functions
```bash
# Deploy Cloud Functions
firebase deploy --only functions
```

### Admin Panel
```bash
# Deploy to Vercel or Firebase Hosting
npm run build
```

## 📚 Learning Resources

This project is designed for learning. Key concepts covered:

1. **React Native Development**: Component architecture, navigation, state management
2. **Firebase Integration**: Authentication, database operations, cloud functions
3. **E-commerce Patterns**: Cart management, checkout flow, payment integration
4. **Mobile UX**: Touch interactions, responsive design, platform-specific features

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve UI/UX
- Optimize performance
- Add comprehensive tests

## 📄 License

MIT License - feel free to use this for learning and personal projects.

## 🆘 Support

For questions about the codebase or Firebase setup:
- Check the inline code comments
- Review the mock data implementations
- Test with the provided seed data

---

**Built with ❤️ for learning mobile app development**