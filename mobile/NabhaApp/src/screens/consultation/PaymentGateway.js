import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const PaymentGateway = ({ language, doctor, consultationType, onNext, onBack }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    walletProvider: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  const translations = {
    en: {
      title: 'Payment',
      subtitle: 'Complete your payment to book consultation',
      consultationFee: 'Consultation Fee',
      platformFee: 'Platform Fee',
      gst: 'GST (18%)',
      discount: 'Discount',
      totalAmount: 'Total Amount',
      paymentMethods: 'Payment Methods',
      upi: 'UPI',
      cards: 'Cards',
      wallet: 'Wallet',
      netBanking: 'Net Banking',
      upiId: 'UPI ID',
      enterUpiId: 'Enter your UPI ID',
      cardNumber: 'Card Number',
      enterCardNumber: 'Enter 16-digit card number',
      expiryDate: 'Expiry Date',
      month: 'MM',
      year: 'YY',
      cvv: 'CVV',
      cardholderName: 'Cardholder Name',
      enterCardholderName: 'Enter name on card',
      selectWallet: 'Select Wallet',
      paytm: 'Paytm',
      phonepe: 'PhonePe',
      googlepay: 'Google Pay',
      amazonpay: 'Amazon Pay',
      couponCode: 'Coupon Code',
      enterCouponCode: 'Enter coupon code',
      applyCoupon: 'Apply',
      couponApplied: 'Coupon Applied',
      invalidCoupon: 'Invalid coupon code',
      payNow: 'Pay Now',
      processing: 'Processing Payment...',
      paymentSuccess: 'Payment Successful',
      paymentFailed: 'Payment Failed',
      continue: 'Continue',
      back: 'Back',
      securePayment: 'Secure Payment',
      ruralDiscount: 'Rural Area Discount',
      governmentScheme: 'Government Scheme',
      freeConsultation: 'Free Consultation',
      subsidizedRate: 'Subsidized Rate',
      savedAmount: 'You saved',
      validationCardNumber: 'Please enter a valid 16-digit card number',
      validationExpiry: 'Please enter valid expiry date',
      validationCvv: 'Please enter valid CVV',
      validationName: 'Please enter cardholder name',
      validationUpi: 'Please enter valid UPI ID',
      validationPayment: 'Please select a payment method',
    },
    hi: {
      title: 'भुगतान',
      subtitle: 'परामर्श बुक करने के लिए अपना भुगतान पूरा करें',
      consultationFee: 'परामर्श शुल्क',
      platformFee: 'प्लेटफॉर्म शुल्क',
      gst: 'जीएसटी (18%)',
      discount: 'छूट',
      totalAmount: 'कुल राशि',
      paymentMethods: 'भुगतान विधियां',
      upi: 'यूपीआई',
      cards: 'कार्ड',
      wallet: 'वॉलेट',
      netBanking: 'नेट बैंकिंग',
      upiId: 'यूपीआई आईडी',
      enterUpiId: 'अपनी यूपीआई आईडी दर्ज करें',
      cardNumber: 'कार्ड नंबर',
      enterCardNumber: '16-अंकीय कार्ड नंबर दर्ज करें',
      expiryDate: 'समाप्ति तिथि',
      month: 'MM',
      year: 'YY',
      cvv: 'CVV',
      cardholderName: 'कार्डधारक का नाम',
      enterCardholderName: 'कार्ड पर नाम दर्ज करें',
      selectWallet: 'वॉलेट चुनें',
      paytm: 'पेटीएम',
      phonepe: 'फोनपे',
      googlepay: 'गूगल पे',
      amazonpay: 'अमेज़न पे',
      couponCode: 'कूपन कोड',
      enterCouponCode: 'कूपन कोड दर्ज करें',
      applyCoupon: 'लागू करें',
      couponApplied: 'कूपन लागू किया गया',
      invalidCoupon: 'अमान्य कूपन कोड',
      payNow: 'अब भुगतान करें',
      processing: 'भुगतान प्रक्रिया में...',
      paymentSuccess: 'भुगतान सफल',
      paymentFailed: 'भुगतान असफल',
      continue: 'जारी रखें',
      back: 'वापस',
      securePayment: 'सुरक्षित भुगतान',
      ruralDiscount: 'ग्रामीण क्षेत्र छूट',
      governmentScheme: 'सरकारी योजना',
      freeConsultation: 'निःशुल्क परामर्श',
      subsidizedRate: 'सब्सिडी दर',
      savedAmount: 'आपने बचाया',
      validationCardNumber: 'कृपया एक वैध 16-अंकीय कार्ड नंबर दर्ज करें',
      validationExpiry: 'कृपया वैध समाप्ति तिथि दर्ज करें',
      validationCvv: 'कृपया वैध CVV दर्ज करें',
      validationName: 'कृपया कार्डधारक का नाम दर्ज करें',
      validationUpi: 'कृपया वैध यूपीआई आईडी दर्ज करें',
      validationPayment: 'कृपया एक भुगतान विधि चुनें',
    },
    pa: {
      title: 'ਭੁਗਤਾਨ',
      subtitle: 'ਸਲਾਹ ਬੁੱਕ ਕਰਨ ਲਈ ਆਪਣਾ ਭੁਗਤਾਨ ਪੂਰਾ ਕਰੋ',
      consultationFee: 'ਸਲਾਹ ਫੀਸ',
      platformFee: 'ਪਲੈਟਫਾਰਮ ਫੀਸ',
      gst: 'ਜੀਐਸਟੀ (18%)',
      discount: 'ਛੋਟ',
      totalAmount: 'ਕੁੱਲ ਰਕਮ',
      paymentMethods: 'ਭੁਗਤਾਨ ਤਰੀਕੇ',
      upi: 'ਯੂਪੀਆਈ',
      cards: 'ਕਾਰਡ',
      wallet: 'ਵਾਲੇਟ',
      netBanking: 'ਨੈੱਟ ਬੈਂਕਿੰਗ',
      upiId: 'ਯੂਪੀਆਈ ID',
      enterUpiId: 'ਆਪਣੀ ਯੂਪੀਆਈ ID ਦਾਖਲ ਕਰੋ',
      cardNumber: 'ਕਾਰਡ ਨੰਬਰ',
      enterCardNumber: '16-ਅੰਕ ਕਾਰਡ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      expiryDate: 'ਮਿਆਦ ਮਿਤੀ',
      month: 'MM',
      year: 'YY',
      cvv: 'CVV',
      cardholderName: 'ਕਾਰਡਧਾਰਕ ਦਾ ਨਾਮ',
      enterCardholderName: 'ਕਾਰਡ ਤੇ ਨਾਮ ਦਾਖਲ ਕਰੋ',
      selectWallet: 'ਵਾਲੇਟ ਚੁਣੋ',
      paytm: 'ਪੇਟੀਐਮ',
      phonepe: 'ਫੋਨਪੇ',
      googlepay: 'ਗੂਗਲ ਪੇ',
      amazonpay: 'ਅਮੇਜ਼ਨ ਪੇ',
      couponCode: 'ਕੂਪਨ ਕੋਡ',
      enterCouponCode: 'ਕੂਪਨ ਕੋਡ ਦਾਖਲ ਕਰੋ',
      applyCoupon: 'ਲਾਗੂ ਕਰੋ',
      couponApplied: 'ਕੂਪਨ ਲਾਗੂ ਕੀਤਾ ਗਿਆ',
      invalidCoupon: 'ਗਲਤ ਕੂਪਨ ਕੋਡ',
      payNow: 'ਹੁਣ ਭੁਗਤਾਨ ਕਰੋ',
      processing: 'ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ...',
      paymentSuccess: 'ਭੁਗਤਾਨ ਸਫਲ',
      paymentFailed: 'ਭੁਗਤਾਨ ਅਸਫਲ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      securePayment: 'ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ',
      ruralDiscount: 'ਪਿੰਡੀ ਖੇਤਰ ਛੋਟ',
      governmentScheme: 'ਸਰਕਾਰੀ ਸਕੀਮ',
      freeConsultation: 'ਮੁਫਤ ਸਲਾਹ',
      subsidizedRate: 'ਸਬਸਿਡੀ ਦਰ',
      savedAmount: 'ਤੁਸੀਂ ਬਚਾਇਆ',
      validationCardNumber: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 16-ਅੰਕ ਕਾਰਡ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      validationExpiry: 'ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਮਿਆਦ ਮਿਤੀ ਦਾਖਲ ਕਰੋ',
      validationCvv: 'ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ CVV ਦਾਖਲ ਕਰੋ',
      validationName: 'ਕਿਰਪਾ ਕਰਕੇ ਕਾਰਡਧਾਰਕ ਦਾ ਨਾਮ ਦਾਖਲ ਕਰੋ',
      validationUpi: 'ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਯੂਪੀਆਈ ID ਦਾਖਲ ਕਰੋ',
      validationPayment: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਭੁਗਤਾਨ ਤਰੀਕਾ ਚੁਣੋ',
    },
  };

  const t = translations[language];

  const consultationFee = doctor?.fees?.[consultationType] || 300;
  const platformFee = 20;
  const gstAmount = Math.round((consultationFee + platformFee) * 0.18);
  
  // Rural discount logic
  const isRuralDiscount = doctor?.isRuralFriendly && doctor?.isGovernmentRates;
  const ruralDiscountAmount = isRuralDiscount ? Math.round(consultationFee * 0.4) : 0;
  const couponDiscountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  
  const totalDiscount = ruralDiscountAmount + couponDiscountAmount;
  const subtotal = consultationFee + platformFee + gstAmount - totalDiscount;
  const finalAmount = Math.max(subtotal, 0);

  const paymentMethods = [
    {
      id: 'upi',
      name: t.upi,
      icon: 'account-balance-wallet',
      color: '#00695C',
      popular: true,
    },
    {
      id: 'cards',
      name: t.cards,
      icon: 'credit-card',
      color: '#1976D2',
      popular: false,
    },
    {
      id: 'wallet',
      name: t.wallet,
      icon: 'wallet',
      color: '#FF9800',
      popular: true,
    },
    {
      id: 'netbanking',
      name: t.netBanking,
      icon: 'account-balance',
      color: '#9C27B0',
      popular: false,
    },
  ];

  const walletProviders = [
    { id: 'paytm', name: t.paytm, icon: 'https://logo.clearbit.com/paytm.com' },
    { id: 'phonepe', name: t.phonepe, icon: 'https://logo.clearbit.com/phonepe.com' },
    { id: 'googlepay', name: t.googlepay, icon: 'https://logo.clearbit.com/pay.google.com' },
    { id: 'amazonpay', name: t.amazonpay, icon: 'https://logo.clearbit.com/pay.amazon.com' },
  ];

  const availableCoupons = [
    { code: 'RURAL50', discount: 50, description: 'Rural Area Special' },
    { code: 'FIRST20', discount: 20, description: 'First Time User' },
    { code: 'HEALTH30', discount: 30, description: 'Health Week Special' },
  ];

  useEffect(() => {
    // Auto-apply rural discount if applicable
    if (isRuralDiscount) {
      setCouponCode('RURAL50');
    }
  }, []);

  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateUpiId = (upiId) => {
    return /^[\w.-]+@[\w.-]+$/.test(upiId);
  };

  const handleCouponApply = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      Alert.alert(t.couponApplied, `${coupon.description} - ₹${coupon.discount} off`);
    } else {
      Alert.alert('Error', t.invalidCoupon);
    }
  };

  const validatePaymentForm = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Validation Error', t.validationPayment);
      return false;
    }

    switch (selectedPaymentMethod) {
      case 'upi':
        if (!validateUpiId(paymentDetails.upiId)) {
          Alert.alert('Validation Error', t.validationUpi);
          return false;
        }
        break;
      case 'cards':
        if (!validateCardNumber(paymentDetails.cardNumber)) {
          Alert.alert('Validation Error', t.validationCardNumber);
          return false;
        }
        if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
          Alert.alert('Validation Error', t.validationExpiry);
          return false;
        }
        if (!/^\d{3}$/.test(paymentDetails.cvv)) {
          Alert.alert('Validation Error', t.validationCvv);
          return false;
        }
        if (!paymentDetails.cardholderName.trim()) {
          Alert.alert('Validation Error', t.validationName);
          return false;
        }
        break;
      case 'wallet':
        if (!paymentDetails.walletProvider) {
          Alert.alert('Validation Error', 'Please select a wallet provider');
          return false;
        }
        break;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 95% success rate for simulation
          if (Math.random() > 0.05) {
            resolve();
          } else {
            reject(new Error('Payment failed'));
          }
        }, 3000);
      });

      Alert.alert(
        t.paymentSuccess,
        `Payment of ₹${finalAmount} completed successfully!`,
        [{ text: 'OK', onPress: () => onNext({ amount: finalAmount, method: selectedPaymentMethod }) }]
      );
    } catch (error) {
      Alert.alert(t.paymentFailed, 'Please try again or use a different payment method.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (text) => {
    return text
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };

  const renderPaymentMethod = (method) => {
    const isSelected = selectedPaymentMethod === method.id;
    
    return (
      <TouchableOpacity
        key={method.id}
        style={[
          styles.paymentMethod,
          isSelected && styles.paymentMethodSelected,
        ]}
        onPress={() => {
          setSelectedPaymentMethod(method.id);
          setShowCardForm(method.id === 'cards');
        }}
      >
        <View style={styles.paymentMethodInfo}>
          <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
            <Icon name={method.icon} size={24} color={method.color} />
          </View>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          {method.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        {isSelected && (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'upi':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>{t.upiId}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t.enterUpiId}
              placeholderTextColor="#999"
              value={paymentDetails.upiId}
              onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, upiId: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        );

      case 'cards':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>{t.cardNumber}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t.enterCardNumber}
              placeholderTextColor="#999"
              value={paymentDetails.cardNumber}
              onChangeText={(text) => setPaymentDetails(prev => ({ 
                ...prev, 
                cardNumber: formatCardNumber(text) 
              }))}
              keyboardType="numeric"
              maxLength={19}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardHalf}>
                <Text style={styles.formLabel}>{t.expiryDate}</Text>
                <View style={styles.expiryContainer}>
                  <TextInput
                    style={[styles.textInput, styles.expiryInput]}
                    placeholder={t.month}
                    placeholderTextColor="#999"
                    value={paymentDetails.expiryMonth}
                    onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, expiryMonth: text }))}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.expirySlash}>/</Text>
                  <TextInput
                    style={[styles.textInput, styles.expiryInput]}
                    placeholder={t.year}
                    placeholderTextColor="#999"
                    value={paymentDetails.expiryYear}
                    onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, expiryYear: text }))}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.cardHalf}>
                <Text style={styles.formLabel}>{t.cvv}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="123"
                  placeholderTextColor="#999"
                  value={paymentDetails.cvv}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cvv: text }))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            <Text style={styles.formLabel}>{t.cardholderName}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t.enterCardholderName}
              placeholderTextColor="#999"
              value={paymentDetails.cardholderName}
              onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cardholderName: text }))}
              autoCapitalize="words"
            />
          </View>
        );

      case 'wallet':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.formLabel}>{t.selectWallet}</Text>
            <View style={styles.walletGrid}>
              {walletProviders.map((wallet) => (
                <TouchableOpacity
                  key={wallet.id}
                  style={[
                    styles.walletOption,
                    paymentDetails.walletProvider === wallet.id && styles.walletOptionSelected,
                  ]}
                  onPress={() => setPaymentDetails(prev => ({ ...prev, walletProvider: wallet.id }))}
                >
                  <Image source={{ uri: wallet.icon }} style={styles.walletIcon} />
                  <Text style={styles.walletName}>{wallet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'netbanking':
        return (
          <View style={styles.paymentForm}>
            <Text style={styles.comingSoon}>Net Banking - Coming Soon</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      {/* Billing Summary */}
      <View style={styles.billingSummary}>
        <Text style={styles.sectionTitle}>Billing Summary</Text>
        
        <View style={styles.billItem}>
          <Text style={styles.billLabel}>{t.consultationFee}</Text>
          <Text style={styles.billAmount}>₹{consultationFee}</Text>
        </View>
        
        <View style={styles.billItem}>
          <Text style={styles.billLabel}>{t.platformFee}</Text>
          <Text style={styles.billAmount}>₹{platformFee}</Text>
        </View>
        
        <View style={styles.billItem}>
          <Text style={styles.billLabel}>{t.gst}</Text>
          <Text style={styles.billAmount}>₹{gstAmount}</Text>
        </View>

        {ruralDiscountAmount > 0 && (
          <View style={styles.billItem}>
            <Text style={[styles.billLabel, styles.discountLabel]}>
              {t.ruralDiscount}
            </Text>
            <Text style={[styles.billAmount, styles.discountAmount]}>
              -₹{ruralDiscountAmount}
            </Text>
          </View>
        )}

        {couponDiscountAmount > 0 && (
          <View style={styles.billItem}>
            <Text style={[styles.billLabel, styles.discountLabel]}>
              {t.discount} ({appliedCoupon.code})
            </Text>
            <Text style={[styles.billAmount, styles.discountAmount]}>
              -₹{couponDiscountAmount}
            </Text>
          </View>
        )}

        <View style={styles.divider} />
        
        <View style={styles.billItem}>
          <Text style={styles.totalLabel}>{t.totalAmount}</Text>
          <Text style={styles.totalAmount}>₹{finalAmount}</Text>
        </View>

        {totalDiscount > 0 && (
          <View style={styles.savingsContainer}>
            <Icon name="local-offer" size={16} color="#4CAF50" />
            <Text style={styles.savingsText}>
              {t.savedAmount} ₹{totalDiscount}
            </Text>
          </View>
        )}
      </View>

      {/* Coupon Code */}
      <View style={styles.couponSection}>
        <Text style={styles.sectionTitle}>{t.couponCode}</Text>
        <View style={styles.couponContainer}>
          <TextInput
            style={styles.couponInput}
            placeholder={t.enterCouponCode}
            placeholderTextColor="#999"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.couponButton}
            onPress={handleCouponApply}
          >
            <Text style={styles.couponButtonText}>{t.applyCoupon}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>{t.paymentMethods}</Text>
        {paymentMethods.map(renderPaymentMethod)}
      </View>

      {/* Payment Form */}
      {selectedPaymentMethod && renderPaymentForm()}

      {/* Security Badge */}
      <View style={styles.securityBadge}>
        <Icon name="security" size={20} color="#4CAF50" />
        <Text style={styles.securityText}>{t.securePayment}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed in PaymentGateway');
            if (onBack && typeof onBack === 'function') {
              onBack();
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.payButton,
            (!selectedPaymentMethod || isProcessing) && styles.payButtonDisabled
          ]} 
          onPress={() => {
            console.log('Pay button pressed, method:', selectedPaymentMethod, 'processing:', isProcessing);
            if (selectedPaymentMethod && !isProcessing) {
              processPayment();
            }
          }}
          disabled={!selectedPaymentMethod || isProcessing}
          activeOpacity={(!selectedPaymentMethod || isProcessing) ? 1 : 0.7}
        >
          <Text style={[
            styles.payButtonText,
            (!selectedPaymentMethod || isProcessing) && { color: '#999' }
          ]}>
            {isProcessing ? t.processing : `${t.payNow} ₹${finalAmount}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  billingSummary: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 16,
    color: '#666',
  },
  billAmount: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  discountLabel: {
    color: '#4CAF50',
  },
  discountAmount: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00695C',
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  couponSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  couponContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  couponButton: {
    backgroundColor: '#00695C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  paymentSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 10,
  },
  paymentMethodSelected: {
    borderColor: '#00695C',
    backgroundColor: '#E0F7FA',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  popularText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  paymentForm: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 15,
  },
  cardHalf: {
    flex: 1,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expiryInput: {
    flex: 1,
    textAlign: 'center',
  },
  expirySlash: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  walletOption: {
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    width: (width - 80) / 2,
  },
  walletOptionSelected: {
    borderColor: '#00695C',
    backgroundColor: '#E0F7FA',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  walletName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  comingSoon: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  payButton: {
    flex: 2,
    paddingVertical: 15,
    backgroundColor: '#00695C',
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  payButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PaymentGateway;
