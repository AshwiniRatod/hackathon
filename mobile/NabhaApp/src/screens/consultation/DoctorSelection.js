import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const DoctorSelection = ({ language, specialty, consultationType, onNext, onBack }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, available, rating, experience
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const translations = {
    en: {
      title: 'Select Doctor',
      subtitle: 'Choose a doctor for your consultation',
      searchPlaceholder: 'Search doctors by name or specialization',
      filterAll: 'All',
      filterAvailable: 'Available',
      filterRating: 'High Rated',
      filterExperience: 'Experienced',
      experience: 'Experience',
      years: 'years',
      rating: 'Rating',
      availability: 'Available',
      unavailable: 'Busy',
      nextAvailable: 'Next available',
      languages: 'Languages',
      education: 'Education',
      specialization: 'Specialization',
      consultationFee: 'Consultation Fee',
      videoCall: 'Video Call',
      voiceCall: 'Voice Call',
      chat: 'Chat',
      selectDoctor: 'Select This Doctor',
      doctorSelected: 'Doctor Selected',
      continue: 'Continue',
      back: 'Back',
      loading: 'Loading doctors...',
      noResults: 'No doctors found',
      ruralFriendly: 'Rural Friendly',
      hindiSupport: 'Hindi Support',
      punjabiSupport: 'Punjabi Support',
      governmentRates: 'Govt. Rates',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
    },
    hi: {
      title: 'डॉक्टर चुनें',
      subtitle: 'अपने परामर्श के लिए एक डॉक्टर चुनें',
      searchPlaceholder: 'नाम या विशेषज्ञता से डॉक्टर खोजें',
      filterAll: 'सभी',
      filterAvailable: 'उपलब्ध',
      filterRating: 'उच्च रेटेड',
      filterExperience: 'अनुभवी',
      experience: 'अनुभव',
      years: 'साल',
      rating: 'रेटिंग',
      availability: 'उपलब्ध',
      unavailable: 'व्यस्त',
      nextAvailable: 'अगली उपलब्धता',
      languages: 'भाषाएं',
      education: 'शिक्षा',
      specialization: 'विशेषज्ञता',
      consultationFee: 'परामर्श शुल्क',
      videoCall: 'वीडियो कॉल',
      voiceCall: 'वॉयस कॉल',
      chat: 'चैट',
      selectDoctor: 'इस डॉक्टर को चुनें',
      doctorSelected: 'डॉक्टर चुना गया',
      continue: 'जारी रखें',
      back: 'वापस',
      loading: 'डॉक्टर लोड हो रहे हैं...',
      noResults: 'कोई डॉक्टर नहीं मिला',
      ruralFriendly: 'ग्रामीण मित्र',
      hindiSupport: 'हिंदी सहायता',
      punjabiSupport: 'पंजाबी सहायता',
      governmentRates: 'सरकारी दरें',
      today: 'आज',
      tomorrow: 'कल',
      thisWeek: 'इस सप्ताह',
    },
    pa: {
      title: 'ਡਾਕਟਰ ਚੁਣੋ',
      subtitle: 'ਆਪਣੀ ਸਲਾਹ ਲਈ ਇੱਕ ਡਾਕਟਰ ਚੁਣੋ',
      searchPlaceholder: 'ਨਾਮ ਜਾਂ ਵਿਸ਼ੇਸ਼ਤਾ ਦੁਆਰਾ ਡਾਕਟਰ ਖੋਜੋ',
      filterAll: 'ਸਾਰੇ',
      filterAvailable: 'ਉਪਲਬਧ',
      filterRating: 'ਉੱਚ ਰੇਟਿੰਗ',
      filterExperience: 'ਤਜ਼ਰਬੇਕਾਰ',
      experience: 'ਤਜ਼ਰਬਾ',
      years: 'ਸਾਲ',
      rating: 'ਰੇਟਿੰਗ',
      availability: 'ਉਪਲਬਧ',
      unavailable: 'ਰੁੱਝਿਆ',
      nextAvailable: 'ਅਗਲੀ ਉਪਲਬਧਤਾ',
      languages: 'ਭਾਸ਼ਾਵਾਂ',
      education: 'ਸਿੱਖਿਆ',
      specialization: 'ਵਿਸ਼ੇਸ਼ਤਾ',
      consultationFee: 'ਸਲਾਹ ਫੀਸ',
      videoCall: 'ਵੀਡੀਓ ਕਾਲ',
      voiceCall: 'ਵੌਇਸ ਕਾਲ',
      chat: 'ਚੈਟ',
      selectDoctor: 'ਇਸ ਡਾਕਟਰ ਨੂੰ ਚੁਣੋ',
      doctorSelected: 'ਡਾਕਟਰ ਚੁਣਿਆ ਗਿਆ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      back: 'ਵਾਪਸ',
      loading: 'ਡਾਕਟਰ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...',
      noResults: 'ਕੋਈ ਡਾਕਟਰ ਨਹੀਂ ਮਿਲਿਆ',
      ruralFriendly: 'ਪਿੰਡੀ ਮਿਤਰ',
      hindiSupport: 'ਹਿੰਦੀ ਸਹਾਇਤਾ',
      punjabiSupport: 'ਪੰਜਾਬੀ ਸਹਾਇਤਾ',
      governmentRates: 'ਸਰਕਾਰੀ ਦਰਾਂ',
      today: 'ਅੱਜ',
      tomorrow: 'ਕੱਲ੍ਹ',
      thisWeek: 'ਇਸ ਹਫ਼ਤੇ',
    },
  };

  const t = translations[language];

  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Medicine',
      experience: 15,
      rating: 4.8,
      languages: ['Hindi', 'English', 'Punjabi'],
      education: 'MBBS, MD - AIIMS Delhi',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      availability: 'available',
      nextSlot: 'Today 2:30 PM',
      fees: {
        video: 300,
        voice: 200,
        chat: 150,
      },
      isRuralFriendly: true,
      isGovernmentRates: true,
      totalConsultations: 1240,
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialization: 'Gynecology',
      experience: 12,
      rating: 4.9,
      languages: ['Hindi', 'English'],
      education: 'MBBS, MS - PGI Chandigarh',
      avatar: 'https://images.unsplash.com/photo-1594824475520-bb3bd9b8dd4e?w=100&h=100&fit=crop&crop=face',
      availability: 'available',
      nextSlot: 'Today 3:00 PM',
      fees: {
        video: 400,
        voice: 300,
        chat: 200,
      },
      isRuralFriendly: true,
      isGovernmentRates: false,
      totalConsultations: 890,
    },
    {
      id: 3,
      name: 'Dr. Gurdeep Singh',
      specialization: 'Pediatrics',
      experience: 18,
      rating: 4.7,
      languages: ['Punjabi', 'Hindi', 'English'],
      education: 'MBBS, MD - CMC Ludhiana',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
      availability: 'busy',
      nextSlot: 'Tomorrow 10:00 AM',
      fees: {
        video: 350,
        voice: 250,
        chat: 180,
      },
      isRuralFriendly: true,
      isGovernmentRates: true,
      totalConsultations: 1560,
    },
    {
      id: 4,
      name: 'Dr. Anjali Patel',
      specialization: 'Dermatology',
      experience: 8,
      rating: 4.6,
      languages: ['Hindi', 'English'],
      education: 'MBBS, MD - JIPMER',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      availability: 'available',
      nextSlot: 'Today 4:00 PM',
      fees: {
        video: 500,
        voice: 350,
        chat: 250,
      },
      isRuralFriendly: false,
      isGovernmentRates: false,
      totalConsultations: 420,
    },
    {
      id: 5,
      name: 'Dr. Harjeet Kaur',
      specialization: 'Cardiology',
      experience: 20,
      rating: 4.9,
      languages: ['Punjabi', 'Hindi', 'English'],
      education: 'MBBS, DM - PGIMER Chandigarh',
      avatar: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop&crop=face',
      availability: 'available',
      nextSlot: 'Today 5:30 PM',
      fees: {
        video: 600,
        voice: 450,
        chat: 300,
      },
      isRuralFriendly: true,
      isGovernmentRates: true,
      totalConsultations: 2100,
    },
  ];

  useEffect(() => {
    // Simulate loading doctors
    setTimeout(() => {
      setDoctors(mockDoctors);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filterOptions = [
    { value: 'all', label: t.filterAll },
    { value: 'available', label: t.filterAvailable },
    { value: 'rating', label: t.filterRating },
    { value: 'experience', label: t.filterExperience },
  ];

  const getFilteredDoctors = () => {
    let filtered = doctors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    switch (filterBy) {
      case 'available':
        filtered = filtered.filter(doctor => doctor.availability === 'available');
        break;
      case 'rating':
        filtered = filtered.filter(doctor => doctor.rating >= 4.7);
        break;
      case 'experience':
        filtered = filtered.filter(doctor => doctor.experience >= 15);
        break;
    }

    // Sort by rating and experience
    return filtered.sort((a, b) => {
      if (a.availability === 'available' && b.availability !== 'available') return -1;
      if (a.availability !== 'available' && b.availability === 'available') return 1;
      return (b.rating * 10 + b.experience) - (a.rating * 10 + a.experience);
    });
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    Alert.alert(
      t.doctorSelected,
      `${doctor.name} - ${doctor.specialization}\n${t.consultationFee}: ₹${doctor.fees[consultationType]}`,
      [
        { text: 'Change', style: 'cancel' },
        { text: 'Confirm', onPress: () => {} }
      ]
    );
  };

  const handleContinue = () => {
    if (!selectedDoctor) {
      Alert.alert('Error', 'Please select a doctor to continue');
      return;
    }
    onNext(selectedDoctor);
  };

  const renderDoctorCard = (doctor) => {
    const isSelected = selectedDoctor?.id === doctor.id;
    const isAvailable = doctor.availability === 'available';

    return (
      <TouchableOpacity
        key={doctor.id}
        style={[
          styles.doctorCard,
          isSelected && styles.doctorCardSelected,
        ]}
        onPress={() => handleSelectDoctor(doctor)}
      >
        {/* Doctor Header */}
        <View style={styles.doctorHeader}>
          <Image source={{ uri: doctor.avatar }} style={styles.doctorAvatar} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
            <Text style={styles.doctorEducation}>{doctor.education}</Text>
          </View>
          <View style={styles.doctorStatus}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isAvailable ? '#4CAF50' : '#FF9800' }
            ]}>
              <Text style={styles.statusText}>
                {isAvailable ? t.availability : t.unavailable}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor Stats */}
        <View style={styles.doctorStats}>
          <View style={styles.statItem}>
            <Icon name="work" size={16} color="#666" />
            <Text style={styles.statText}>{doctor.experience} {t.years}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{doctor.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="people" size={16} color="#666" />
            <Text style={styles.statText}>{doctor.totalConsultations}</Text>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.languagesContainer}>
          <Text style={styles.sectionLabel}>{t.languages}:</Text>
          <View style={styles.languagesList}>
            {doctor.languages.map((lang) => (
              <View key={lang} style={styles.languageTag}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Special Badges */}
        <View style={styles.badgesContainer}>
          {doctor.isRuralFriendly && (
            <View style={[styles.badge, styles.ruralBadge]}>
              <Icon name="agriculture" size={14} color="#2E7D32" />
              <Text style={styles.badgeText}>{t.ruralFriendly}</Text>
            </View>
          )}
          {doctor.isGovernmentRates && (
            <View style={[styles.badge, styles.govBadge]}>
              <Icon name="account-balance" size={14} color="#1565C0" />
              <Text style={styles.badgeText}>{t.governmentRates}</Text>
            </View>
          )}
          {doctor.languages.includes('Hindi') && (
            <View style={[styles.badge, styles.langBadge]}>
              <Text style={styles.badgeText}>{t.hindiSupport}</Text>
            </View>
          )}
          {doctor.languages.includes('Punjabi') && (
            <View style={[styles.badge, styles.langBadge]}>
              <Text style={styles.badgeText}>{t.punjabiSupport}</Text>
            </View>
          )}
        </View>

        {/* Consultation Fee */}
        <View style={styles.feeContainer}>
          <Text style={styles.feeLabel}>{t.consultationFee}:</Text>
          <Text style={styles.feeAmount}>₹{doctor.fees[consultationType]}</Text>
        </View>

        {/* Next Available */}
        <View style={styles.availabilityContainer}>
          <Icon 
            name="schedule" 
            size={16} 
            color={isAvailable ? '#4CAF50' : '#FF9800'} 
          />
          <Text style={styles.availabilityText}>
            {isAvailable ? doctor.nextSlot : `${t.nextAvailable}: ${doctor.nextSlot}`}
          </Text>
        </View>

        {/* Select Button */}
        <TouchableOpacity
          style={[
            styles.selectButton,
            isSelected && styles.selectButtonSelected,
            !isAvailable && styles.selectButtonDisabled,
          ]}
          onPress={() => handleSelectDoctor(doctor)}
          disabled={!isAvailable}
        >
          <Text style={[
            styles.selectButtonText,
            isSelected && styles.selectButtonTextSelected,
          ]}>
            {isSelected ? t.doctorSelected : t.selectDoctor}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="local-hospital" size={50} color="#00695C" />
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Options */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterOption,
                filterBy === option.value && styles.filterOptionSelected,
              ]}
              onPress={() => setFilterBy(option.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterBy === option.value && styles.filterTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Doctors List */}
      <ScrollView style={styles.doctorsList} showsVerticalScrollIndicator={false}>
        {getFilteredDoctors().length === 0 ? (
          <View style={styles.noResults}>
            <Icon name="person-search" size={50} color="#ccc" />
            <Text style={styles.noResultsText}>{t.noResults}</Text>
          </View>
        ) : (
          getFilteredDoctors().map(renderDoctorCard)
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('Back button pressed in DoctorSelection');
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
            !selectedDoctor && styles.continueButtonDisabled
          ]} 
          onPress={() => {
            console.log('Continue button pressed in DoctorSelection, selected doctor:', selectedDoctor?.name);
            if (selectedDoctor) {
              handleContinue();
            }
          }}
          disabled={!selectedDoctor}
          activeOpacity={!selectedDoctor ? 1 : 0.7}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedDoctor && { color: '#999' }
          ]}>
            {t.continue}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  header: {
    padding: 20,
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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  filterOptionSelected: {
    backgroundColor: '#00695C',
    borderColor: '#00695C',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#fff',
  },
  doctorsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  doctorCardSelected: {
    borderColor: '#00695C',
    shadowOpacity: 0.2,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#00695C',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorEducation: {
    fontSize: 12,
    color: '#666',
  },
  doctorStatus: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  doctorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  languagesContainer: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ruralBadge: {
    backgroundColor: '#E8F5E8',
  },
  govBadge: {
    backgroundColor: '#E3F2FD',
  },
  langBadge: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695C',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  availabilityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00695C',
  },
  selectButtonSelected: {
    backgroundColor: '#00695C',
  },
  selectButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00695C',
  },
  selectButtonTextSelected: {
    color: '#fff',
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

export default DoctorSelection;
