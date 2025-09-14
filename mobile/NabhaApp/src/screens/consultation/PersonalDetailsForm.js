import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const PersonalDetailsForm = ({ language, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadharNumber: '',
    bloodGroup: '',
  });

  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const translations = {
    en: {
      title: 'Personal Details',
      subtitle: 'Please provide your personal information for consultation',
      firstName: 'First Name',
      lastName: 'Last Name', 
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      phoneNumber: 'Phone Number',
      emergencyContact: 'Emergency Contact',
      address: 'Address',
      city: 'City',
      state: 'State',
      pincode: 'PIN Code',
      aadharNumber: 'Aadhar Number (Optional)',
      bloodGroup: 'Blood Group (Optional)',
      continue: 'Continue',
      back: 'Back',
      required: 'This field is required',
      invalidPhone: 'Please enter a valid 10-digit phone number',
      invalidAge: 'Please enter a valid age (1-120)',
      invalidPincode: 'Please enter a valid 6-digit PIN code',
      invalidAadhar: 'Please enter a valid 12-digit Aadhar number',
      formValidation: 'Please fill all required fields correctly',
      autoFill: 'Auto-fill from profile',
      saveProfile: 'Save to profile',
      ruralArea: 'Rural Area',
      enterFirstName: 'Enter your first name',
      enterLastName: 'Enter your last name',
      enterAge: 'Enter your age',
      selectGender: 'Select your gender',
      enterPhone: 'Enter 10-digit phone number',
      enterEmergency: 'Enter emergency contact number',
      enterAddress: 'Enter your complete address',
      enterCity: 'Enter your city',
      enterState: 'Enter your state',
      enterPincode: 'Enter 6-digit PIN code',
      enterAadhar: 'Enter 12-digit Aadhar number',
      selectBloodGroup: 'Select blood group',
    },
    hi: {
      title: 'व्यक्तिगत विवरण',
      subtitle: 'कृपया परामर्श के लिए अपनी व्यक्तिगत जानकारी प्रदान करें',
      firstName: 'पहला नाम',
      lastName: 'अंतिम नाम',
      age: 'उम्र',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      phoneNumber: 'फोन नंबर',
      emergencyContact: 'आपातकालीन संपर्क',
      address: 'पता',
      city: 'शहर',
      state: 'राज्य',
      pincode: 'पिन कोड',
      aadharNumber: 'आधार नंबर (वैकल्पिक)',
      bloodGroup: 'रक्त समूह (वैकल्पिक)',
      continue: 'जारी रखें',
      back: 'वापस',
      required: 'यह फ़ील्ड आवश्यक है',
      invalidPhone: 'कृपया एक वैध 10-अंकीय फोन नंबर दर्ज करें',
      invalidAge: 'कृपया एक वैध उम्र दर्ज करें (1-120)',
      invalidPincode: 'कृपया एक वैध 6-अंकीय पिन कोड दर्ज करें',
      invalidAadhar: 'कृपया एक वैध 12-अंकीय आधार नंबर दर्ज करें',
      formValidation: 'कृपया सभी आवश्यक फ़ील्ड सही तरीके से भरें',
      autoFill: 'प्रोफाइल से ऑटो-भरें',
      saveProfile: 'प्रोफाइल में सेव करें',
      ruralArea: 'ग्रामीण क्षेत्र',
      enterFirstName: 'अपना पहला नाम दर्ज करें',
      enterLastName: 'अपना अंतिम नाम दर्ज करें',
      enterAge: 'अपनी उम्र दर्ज करें',
      selectGender: 'अपना लिंग चुनें',
      enterPhone: '10-अंकीय फोन नंबर दर्ज करें',
      enterEmergency: 'आपातकालीन संपर्क नंबर दर्ज करें',
      enterAddress: 'अपना पूरा पता दर्ज करें',
      enterCity: 'अपना शहर दर्ज करें',
      enterState: 'अपना राज्य दर्ज करें',
      enterPincode: '6-अंकीय पिन कोड दर्ज करें',
      enterAadhar: '12-अंकीय आधार नंबर दर्ज करें',
      selectBloodGroup: 'रक्त समूह चुनें',
    },
    pa: {
      title: 'ਨਿੱਜੀ ਵੇਰਵੇ',
      subtitle: 'ਕਿਰਪਾ ਕਰਕੇ ਸਲਾਹ ਲਈ ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰੋ',
      firstName: 'ਪਹਿਲਾ ਨਾਮ',
      lastName: 'ਅਖੀਰਲਾ ਨਾਮ',
      age: 'ਉਮਰ',
      gender: 'ਲਿੰਗ',
      male: 'ਮਰਦ',
      female: 'ਔਰਤ',
      other: 'ਹੋਰ',
      phoneNumber: 'ਫੋਨ ਨੰਬਰ',
      emergencyContact: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
      address: 'ਪਤਾ',
      city: 'ਸ਼ਹਿਰ',
      state: 'ਰਾਜ',
      pincode: 'ਪਿੰਨ ਕੋਡ',
      aadharNumber: 'ਆਧਾਰ ਨੰਬਰ (ਵਿਕਲਪਿਕ)',
      bloodGroup: 'ਖੂਨ ਦਾ ਗਰੁੱਪ (ਵਿਕਲਪਿਕ)',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      required: 'ਇਹ ਫੀਲਡ ਲਾਜ਼ਮੀ ਹੈ',
      invalidPhone: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      invalidAge: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਉਮਰ ਦਾਖਲ ਕਰੋ (1-120)',
      invalidPincode: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 6-ਅੰਕ ਪਿੰਨ ਕੋਡ ਦਾਖਲ ਕਰੋ',
      invalidAadhar: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 12-ਅੰਕ ਆਧਾਰ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      formValidation: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਲਾਜ਼ਮੀ ਖੇਤਰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਭਰੋ',
      autoFill: 'ਪ੍ਰੋਫਾਈਲ ਤੋਂ ਆਟੋ-ਭਰੋ',
      saveProfile: 'ਪ੍ਰੋਫਾਈਲ ਵਿੱਚ ਸੇਵ ਕਰੋ',
      ruralArea: 'ਪਿੰਡੀ ਖੇਤਰ',
      enterFirstName: 'ਆਪਣਾ ਪਹਿਲਾ ਨਾਮ ਦਾਖਲ ਕਰੋ',
      enterLastName: 'ਆਪਣਾ ਅਖੀਰਲਾ ਨਾਮ ਦਾਖਲ ਕਰੋ',
      enterAge: 'ਆਪਣੀ ਉਮਰ ਦਾਖਲ ਕਰੋ',
      selectGender: 'ਆਪਣਾ ਲਿੰਗ ਚੁਣੋ',
      enterPhone: '10-ਅੰਕ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      enterEmergency: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      enterAddress: 'ਆਪਣਾ ਪੂਰਾ ਪਤਾ ਦਾਖਲ ਕਰੋ',
      enterCity: 'ਆਪਣਾ ਸ਼ਹਿਰ ਦਾਖਲ ਕਰੋ',
      enterState: 'ਆਪਣਾ ਰਾਜ ਦਾਖਲ ਕਰੋ',
      enterPincode: '6-ਅੰਕ ਪਿੰਨ ਕੋਡ ਦਾਖਲ ਕਰੋ',
      enterAadhar: '12-ਅੰਕ ਆਧਾਰ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
      selectBloodGroup: 'ਖੂਨ ਦਾ ਗਰੁੱਪ ਚੁਣੋ',
    },
  };

  const t = translations[language];

  const genderOptions = [
    { value: 'male', label: t.male },
    { value: 'female', label: t.female },
    { value: 'other', label: t.other },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const states = [
    'Punjab', 'Haryana', 'Himachal Pradesh', 'Delhi', 'Rajasthan',
    'Uttar Pradesh', 'Uttarakhand', 'Bihar', 'Jharkhand', 'West Bengal',
    'Odisha', 'Chhattisgarh', 'Madhya Pradesh', 'Gujarat', 'Maharashtra',
    'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana',
    'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Sikkim', 'Tripura', 'Goa', 'Jammu and Kashmir', 'Ladakh'
  ];

  useEffect(() => {
    // Auto-fill with sample data for rural user
    autoFillSampleData();
  }, []);

  const autoFillSampleData = () => {
    setFormData({
      firstName: 'Gurpreet',
      lastName: 'Singh',
      age: '35',
      gender: 'male',
      phoneNumber: '9876543210',
      emergencyContact: '9876543211',
      address: 'Village Khanna, Tehsil Samrala',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141114',
      aadharNumber: '',
      bloodGroup: 'B+',
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length >= 2 ? '' : t.required;
      case 'age':
        const age = parseInt(value);
        return age >= 1 && age <= 120 ? '' : t.invalidAge;
      case 'gender':
        return value ? '' : t.required;
      case 'phoneNumber':
      case 'emergencyContact':
        return /^[6-9]\d{9}$/.test(value) ? '' : t.invalidPhone;
      case 'address':
      case 'city':
      case 'state':
        return value.trim().length >= 2 ? '' : t.required;
      case 'pincode':
        return /^\d{6}$/.test(value) ? '' : t.invalidPincode;
      case 'aadharNumber':
        return !value || /^\d{12}$/.test(value.replace(/\s/g, '')) ? '' : t.invalidAadhar;
      default:
        return '';
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name, value) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName', 'lastName', 'age', 'gender', 
      'phoneNumber', 'emergencyContact', 'address', 
      'city', 'state', 'pincode'
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate optional fields if they have values
    if (formData.aadharNumber) {
      const aadharError = validateField('aadharNumber', formData.aadharNumber);
      if (aadharError) {
        newErrors.aadharNumber = aadharError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    setIsValidating(true);
    
    if (validateForm()) {
      // Save form data and proceed
      Alert.alert(
        'Details Saved',
        'Your personal details have been saved successfully.',
        [{ text: 'OK', onPress: onNext }]
      );
    } else {
      Alert.alert('Validation Error', t.formValidation);
    }
    
    setIsValidating(false);
  };

  const formatAadharNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 14); // Max 12 digits + 2 spaces
  };

  const renderInput = (name, placeholder, options = {}) => {
    const hasError = errors[name];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {placeholder}
          {!options.optional && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            hasError && styles.textInputError,
            options.multiline && styles.textInputMultiline,
          ]}
          value={formData[name]}
          onChangeText={(value) => {
            if (name === 'aadharNumber') {
              value = formatAadharNumber(value);
            }
            handleInputChange(name, value);
          }}
          onBlur={() => handleBlur(name, formData[name])}
          placeholder={options.placeholder || placeholder}
          placeholderTextColor="#999"
          keyboardType={options.keyboardType || 'default'}
          multiline={options.multiline}
          numberOfLines={options.numberOfLines}
          maxLength={options.maxLength}
          autoCapitalize={options.autoCapitalize || 'words'}
        />
        {hasError && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={16} color="#F44336" />
            <Text style={styles.errorText}>{hasError}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderGenderSelector = () => {
    const hasError = errors.gender;
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {t.gender}
          <Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.genderContainer}>
          {genderOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderOption,
                formData.gender === option.value && styles.genderOptionSelected,
                hasError && styles.genderOptionError,
                index === 0 && { marginLeft: 0 },
                index === genderOptions.length - 1 && { marginRight: 0 },
              ]}
              onPress={() => handleInputChange('gender', option.value)}
            >
              <Text
                style={[
                  styles.genderText,
                  formData.gender === option.value && styles.genderTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {hasError && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={16} color="#F44336" />
            <Text style={styles.errorText}>{hasError}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDropdown = (name, placeholder, options, optional = false) => {
    const hasError = errors[name];
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {placeholder}
          {!optional && <Text style={styles.required}> *</Text>}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dropdownContainer}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dropdownOption,
                formData[name] === option && styles.dropdownOptionSelected,
                hasError && styles.dropdownOptionError,
              ]}
              onPress={() => handleInputChange(name, option)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  formData[name] === option && styles.dropdownTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {hasError && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={16} color="#F44336" />
            <Text style={styles.errorText}>{hasError}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        
        <TouchableOpacity style={styles.autoFillButton} onPress={autoFillSampleData}>
          <Icon name="auto-fix-high" size={20} color="#00695C" />
          <Text style={styles.autoFillText}>{t.autoFill}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInput('firstName', t.firstName, { 
              placeholder: t.enterFirstName,
              autoCapitalize: 'words'
            })}
          </View>
          <View style={styles.halfWidth}>
            {renderInput('lastName', t.lastName, { 
              placeholder: t.enterLastName,
              autoCapitalize: 'words'
            })}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInput('age', t.age, { 
              placeholder: t.enterAge,
              keyboardType: 'numeric',
              maxLength: 3
            })}
          </View>
          <View style={styles.halfWidth}>
            {/* Empty space or could add another field here */}
          </View>
        </View>

        {/* Gender selector in its own full-width row */}
        {renderGenderSelector()}

        {renderInput('phoneNumber', t.phoneNumber, { 
          placeholder: t.enterPhone,
          keyboardType: 'phone-pad',
          maxLength: 10
        })}

        {renderInput('emergencyContact', t.emergencyContact, { 
          placeholder: t.enterEmergency,
          keyboardType: 'phone-pad',
          maxLength: 10
        })}

        {renderInput('address', t.address, { 
          placeholder: t.enterAddress,
          multiline: true,
          numberOfLines: 3,
          autoCapitalize: 'words'
        })}

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderInput('city', t.city, { 
              placeholder: t.enterCity,
              autoCapitalize: 'words'
            })}
          </View>
          <View style={styles.halfWidth}>
            {renderInput('pincode', t.pincode, { 
              placeholder: t.enterPincode,
              keyboardType: 'numeric',
              maxLength: 6
            })}
          </View>
        </View>

        {renderDropdown('state', t.state, states)}

        {renderInput('aadharNumber', t.aadharNumber, { 
          placeholder: t.enterAadhar,
          keyboardType: 'numeric',
          maxLength: 14,
          optional: true
        })}

        {renderDropdown('bloodGroup', t.bloodGroup, bloodGroups, true)}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed in PersonalDetailsForm');
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
            styles.continueButton,
            isValidating && styles.continueButtonDisabled
          ]} 
          onPress={() => {
            console.log('Continue button pressed in PersonalDetailsForm');
            if (!isValidating) {
              handleContinue();
            }
          }}
          disabled={isValidating}
          activeOpacity={isValidating ? 1 : 0.7}
        >
          <Text style={[
            styles.continueButtonText,
            isValidating && { color: '#999' }
          ]}>
            {isValidating ? 'Validating...' : t.continue}
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E0F7FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00695C',
  },
  autoFillText: {
    fontSize: 14,
    color: '#00695C',
    fontWeight: '600',
    marginLeft: 8,
  },
  form: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textInputError: {
    borderColor: '#F44336',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
    flexWrap: 'nowrap',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  genderOptionSelected: {
    borderColor: '#00695C',
    backgroundColor: '#E0F7FA',
  },
  genderOptionError: {
    borderColor: '#F44336',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  genderTextSelected: {
    color: '#00695C',
    fontWeight: '600',
  },
  dropdownContainer: {
    maxHeight: 50,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  dropdownOptionSelected: {
    borderColor: '#00695C',
    backgroundColor: '#E0F7FA',
  },
  dropdownOptionError: {
    borderColor: '#F44336',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dropdownTextSelected: {
    color: '#00695C',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
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
  continueButton: {
    flex: 2,
    paddingVertical: 15,
    backgroundColor: '#00695C',
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PersonalDetailsForm;
