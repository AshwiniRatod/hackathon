import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
  SafeAreaView
} from 'react-native';
import symptomsDatabase from '../data/symptomsDatabase.json';

const CheckSymptomsScreen = ({ visible, onClose, language = 'en' }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const translations = {
    en: {
      title: "🩺 Check Symptoms",
      step1: "Step 1: Select Your Age Group",
      step2: "Step 2: Select Symptoms",
      step3: "Step 3: Additional Details",
      step4: "Step 4: Analysis Results",
      searchPlaceholder: "Search symptoms...",
      selectedSymptoms: "Selected Symptoms:",
      severity: "Severity Level:",
      duration: "How long have you had these symptoms?",
      medicalHistory: "Any known medical conditions or allergies?",
      analyze: "Analyze Symptoms",
      emergency: "🚨 EMERGENCY",
      seekImmediate: "Seek immediate medical attention!",
      doctorRecommended: "Doctor consultation recommended",
      selfCare: "Self-care may be sufficient",
      possibleConditions: "Possible Conditions:",
      homeRemedies: "Home Remedies:",
      nextSteps: "Recommended Next Steps:",
      back: "Back",
      next: "Next",
      startOver: "Start Over",
      contactEmergency: "Contact Emergency Services",
      bookConsultation: "Book Doctor Consultation"
    },
    hi: {
      title: "🩺 लक्षण जांचें",
      step1: "चरण 1: अपना आयु समूह चुनें",
      step2: "चरण 2: लक्षण चुनें",
      step3: "चरण 3: अतिरिक्त विवरण",
      step4: "चरण 4: विश्लेषण परिणाम",
      searchPlaceholder: "लक्षण खोजें...",
      selectedSymptoms: "चयनित लक्षण:",
      severity: "गंभीरता का स्तर:",
      duration: "आपको ये लक्षण कितने समय से हैं?",
      medicalHistory: "कोई ज्ञात चिकित्सा स्थिति या एलर्जी?",
      analyze: "लक्षणों का विश्लेषण करें",
      emergency: "🚨 आपातकाल",
      seekImmediate: "तुरंत चिकित्सा सहायता लें!",
      doctorRecommended: "डॉक्टर से सलाह की सिफारिश",
      selfCare: "स्व-देखभाल पर्याप्त हो सकती है",
      possibleConditions: "संभावित स्थितियां:",
      homeRemedies: "घरेलू उपचार:",
      nextSteps: "अनुशंसित अगले कदम:",
      back: "वापस",
      next: "आगे",
      startOver: "फिर से शुरू",
      contactEmergency: "आपातकालीन सेवाओं से संपर्क करें",
      bookConsultation: "डॉक्टर से सलाह बुक करें"
    },
    pa: {
      title: "🩺 ਲੱਛਣ ਜਾਂਚੋ",
      step1: "ਕਦਮ 1: ਆਪਣਾ ਉਮਰ ਸਮੂਹ ਚੁਣੋ",
      step2: "ਕਦਮ 2: ਲੱਛਣ ਚੁਣੋ",
      step3: "ਕਦਮ 3: ਵਾਧੂ ਵੇਰਵੇ",
      step4: "ਕਦਮ 4: ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ",
      searchPlaceholder: "ਲੱਛਣ ਖੋਜੋ...",
      selectedSymptoms: "ਚੁਣੇ ਗਏ ਲੱਛਣ:",
      severity: "ਗੰਭੀਰਤਾ ਦਾ ਪੱਧਰ:",
      duration: "ਤੁਹਾਨੂੰ ਇਹ ਲੱਛਣ ਕਿੰਨੇ ਸਮੇਂ ਤੋਂ ਹਨ?",
      medicalHistory: "ਕੋਈ ਜਾਣੀ ਮੈਡੀਕਲ ਸਥਿਤੀ ਜਾਂ ਐਲਰਜੀ?",
      analyze: "ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
      emergency: "🚨 ਐਮਰਜੈਂਸੀ",
      seekImmediate: "ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਲਓ!",
      doctorRecommended: "ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਦੀ ਸਿਫਾਰਸ਼",
      selfCare: "ਸਵੈ-ਦੇਖਭਾਲ ਕਾਫੀ ਹੋ ਸਕਦੀ ਹੈ",
      possibleConditions: "ਸੰਭਵ ਸਥਿਤੀਆਂ:",
      homeRemedies: "ਘਰੇਲੂ ਇਲਾਜ:",
      nextSteps: "ਸਿਫਾਰਸ਼ੀ ਅਗਲੇ ਕਦਮ:",
      back: "ਵਾਪਸ",
      next: "ਅੱਗੇ",
      startOver: "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ",
      contactEmergency: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      bookConsultation: "ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਬੁੱਕ ਕਰੋ"
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    filterSymptoms();
  }, [searchText]);

  const filterSymptoms = () => {
    if (!searchText) {
      setFilteredSymptoms(symptomsDatabase.symptoms);
    } else {
      const filtered = symptomsDatabase.symptoms.filter(symptom => {
        const name = language === 'hi' ? symptom.nameHi : 
                    language === 'pa' ? symptom.namePa : symptom.name;
        return name.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredSymptoms(filtered);
    }
  };

  const toggleSymptom = (symptom) => {
    const isSelected = selectedSymptoms.find(s => s.id === symptom.id);
    if (isSelected) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      
      // Check for emergency symptoms
      if (symptom.emergency) {
        Alert.alert(
          t.emergency,
          `${t.seekImmediate}\n\nSymptom: ${getSymptomName(symptom)}\n\nThis could be a serious medical emergency. Please contact emergency services immediately.`,
          [
            { text: t.contactEmergency, onPress: () => handleEmergencyCall() },
            { text: 'Continue Assessment', style: 'cancel' }
          ]
        );
      }
    }
  };

  const getSymptomName = (symptom) => {
    return language === 'hi' ? symptom.nameHi : 
           language === 'pa' ? symptom.namePa : symptom.name;
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS SYSTEM',
      'Punjab Emergency Services\n\nSelect the type of emergency assistance needed:',
      [
        { text: '🚑 Medical Emergency (108)', onPress: () => console.log('Calling 108') },
        { text: '🏥 Nabha Hospital', onPress: () => console.log('Calling Hospital') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No Symptoms Selected', 'Please select at least one symptom to analyze.');
      return;
    }

    // Check for emergency symptoms
    const emergencySymptoms = selectedSymptoms.filter(s => s.emergency);
    
    // Calculate possible conditions
    const conditionMap = {};
    selectedSymptoms.forEach(symptom => {
      symptom.conditions.forEach(condition => {
        if (!conditionMap[condition.name]) {
          conditionMap[condition.name] = {
            name: condition.name,
            probability: 0,
            severity: condition.severity,
            count: 0
          };
        }
        conditionMap[condition.name].probability += condition.probability;
        conditionMap[condition.name].count += 1;
      });
    });

    // Sort conditions by probability
    const possibleConditions = Object.values(conditionMap)
      .map(condition => ({
        ...condition,
        probability: condition.probability / condition.count
      }))
      .sort((a, b) => b.probability - a.probability);

    // Determine urgency level
    let urgencyLevel = 'low';
    let urgencyColor = '#4CAF50';
    let urgencyIcon = '😌';
    let recommendation = t.selfCare;

    if (emergencySymptoms.length > 0) {
      urgencyLevel = 'critical';
      urgencyColor = '#D32F2F';
      urgencyIcon = '🚨';
      recommendation = t.seekImmediate;
    } else if (possibleConditions.length > 0 && possibleConditions[0].severity === 'high') {
      urgencyLevel = 'high';
      urgencyColor = '#F44336';
      urgencyIcon = '😰';
      recommendation = t.doctorRecommended;
    } else if (severity === 'severe' || selectedSymptoms.length >= 3) {
      urgencyLevel = 'medium';
      urgencyColor = '#FF9800';
      urgencyIcon = '😐';
      recommendation = t.doctorRecommended;
    }

    setAnalysisResults({
      urgencyLevel,
      urgencyColor,
      urgencyIcon,
      recommendation,
      possibleConditions: possibleConditions.slice(0, 3),
      emergencySymptoms
    });

    setShowResults(true);
    setCurrentStep(4);
  };

  const resetAssessment = () => {
    setSelectedSymptoms([]);
    setSearchText('');
    setCurrentStep(1);
    setAgeGroup('');
    setSeverity('');
    setDuration('');
    setMedicalHistory('');
    setShowResults(false);
    setAnalysisResults(null);
  };

  const renderSymptomItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.symptomItem,
        selectedSymptoms.find(s => s.id === item.id) && styles.selectedSymptom,
        item.emergency && styles.emergencySymptom
      ]}
      onPress={() => toggleSymptom(item)}
    >
      <View style={styles.symptomContent}>
        <Text style={styles.symptomName}>{getSymptomName(item)}</Text>
        <Text style={styles.symptomCategory}>{item.category}</Text>
        {item.emergency && (
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyText}>🚨 Emergency</Text>
          </View>
        )}
      </View>
      <Text style={styles.checkmark}>
        {selectedSymptoms.find(s => s.id === item.id) ? '✅' : '⭕'}
      </Text>
    </TouchableOpacity>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.step1}</Text>
            {symptomsDatabase.ageGroups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.ageGroupItem,
                  ageGroup === group.id && styles.selectedAgeGroup
                ]}
                onPress={() => setAgeGroup(group.id)}
              >
                <Text style={styles.ageGroupText}>
                  {language === 'hi' ? group.labelHi : 
                   language === 'pa' ? group.labelPa : group.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.step2}</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />

            {selectedSymptoms.length > 0 && (
              <View style={styles.selectedSymptomsContainer}>
                <Text style={styles.selectedSymptomsTitle}>{t.selectedSymptoms}</Text>
                <View style={styles.selectedSymptomsList}>
                  {selectedSymptoms.map(symptom => (
                    <View key={symptom.id} style={styles.selectedSymptomChip}>
                      <Text style={styles.selectedSymptomText}>
                        {getSymptomName(symptom)}
                      </Text>
                      <TouchableOpacity onPress={() => toggleSymptom(symptom)}>
                        <Text style={styles.removeSymptom}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <FlatList
              data={filteredSymptoms}
              renderItem={renderSymptomItem}
              keyExtractor={item => item.id.toString()}
              style={styles.symptomsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.step3}</Text>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t.severity}</Text>
              <View style={styles.severityButtons}>
                {['mild', 'moderate', 'severe'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityButton,
                      severity === level && styles.selectedSeverity
                    ]}
                    onPress={() => setSeverity(level)}
                  >
                    <Text style={styles.severityText}>
                      {symptomsDatabase.severityLevels.find(s => s.id === level)?.icon} {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t.duration}</Text>
              <View style={styles.durationButtons}>
                {['< 1 day', '1-3 days', '3-7 days', '> 1 week'].map(dur => (
                  <TouchableOpacity
                    key={dur}
                    style={[
                      styles.durationButton,
                      duration === dur && styles.selectedDuration
                    ]}
                    onPress={() => setDuration(dur)}
                  >
                    <Text style={styles.durationText}>{dur}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>{t.medicalHistory}</Text>
              <TextInput
                style={styles.historyInput}
                placeholder="Enter any known conditions, allergies, or medications..."
                value={medicalHistory}
                onChangeText={setMedicalHistory}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{t.step4}</Text>
            
            {analysisResults && (
              <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                <View style={[styles.urgencyCard, { borderColor: analysisResults.urgencyColor }]}>
                  <Text style={styles.urgencyIcon}>{analysisResults.urgencyIcon}</Text>
                  <Text style={[styles.urgencyText, { color: analysisResults.urgencyColor }]}>
                    {analysisResults.recommendation}
                  </Text>
                </View>

                {analysisResults.emergencySymptoms.length > 0 && (
                  <View style={styles.emergencyWarning}>
                    <Text style={styles.emergencyWarningText}>
                      ⚠️ Emergency symptoms detected! Seek immediate medical attention.
                    </Text>
                    <TouchableOpacity 
                      style={styles.emergencyButton}
                      onPress={handleEmergencyCall}
                    >
                      <Text style={styles.emergencyButtonText}>{t.contactEmergency}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.conditionsSection}>
                  <Text style={styles.sectionTitle}>{t.possibleConditions}</Text>
                  {analysisResults.possibleConditions.map((condition, index) => (
                    <View key={index} style={styles.conditionItem}>
                      <Text style={styles.conditionName}>{condition.name}</Text>
                      <Text style={styles.conditionProbability}>
                        Likelihood: {(condition.probability * 100).toFixed(0)}%
                      </Text>
                      <Text style={styles.conditionSeverity}>
                        Severity: {condition.severity}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.consultButton}>
                    <Text style={styles.consultButtonText}>{t.bookConsultation}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.startOverButton}
                    onPress={resetAssessment}
                  >
                    <Text style={styles.startOverButtonText}>{t.startOver}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step {currentStep}/4</Text>
          </View>
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>

        <View style={styles.navigation}>
          {currentStep > 1 && !showResults && (
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.navButtonText}>{t.back}</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 && (
            <TouchableOpacity 
              style={[
                styles.navButton,
                styles.nextButton,
                (currentStep === 1 && !ageGroup) || 
                (currentStep === 2 && selectedSymptoms.length === 0) ? 
                styles.disabledButton : null
              ]}
              onPress={() => {
                if (currentStep === 1 && !ageGroup) return;
                if (currentStep === 2 && selectedSymptoms.length === 0) return;
                setCurrentStep(currentStep + 1);
              }}
            >
              <Text style={styles.navButtonText}>{t.next}</Text>
            </TouchableOpacity>
          )}
          
          {currentStep === 3 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.analyzeButton]}
              onPress={analyzeSymptoms}
            >
              <Text style={styles.navButtonText}>{t.analyze}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  stepIndicator: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  stepText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  ageGroupItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedAgeGroup: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  ageGroupText: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  selectedSymptomsContainer: {
    marginBottom: 15,
  },
  selectedSymptomsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  selectedSymptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedSymptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 3,
  },
  selectedSymptomText: {
    color: '#fff',
    marginRight: 8,
  },
  removeSymptom: {
    color: '#fff',
    fontWeight: 'bold',
  },
  symptomsList: {
    flex: 1,
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 3,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSymptom: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  emergencySymptom: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  symptomContent: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  symptomCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emergencyBadge: {
    marginTop: 5,
  },
  emergencyText: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 20,
  },
  detailSection: {
    marginBottom: 25,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    padding: 12,
    margin: 3,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedSeverity: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  severityText: {
    fontSize: 12,
    textAlign: 'center',
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  durationButton: {
    padding: 10,
    margin: 3,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDuration: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  durationText: {
    fontSize: 12,
  },
  historyInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  resultsContainer: {
    flex: 1,
  },
  urgencyCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  urgencyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  urgencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyWarning: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  emergencyWarningText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  conditionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  conditionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  conditionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  conditionProbability: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  conditionSeverity: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionButtons: {
    marginTop: 20,
  },
  consultButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  consultButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startOverButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  startOverButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  nextButton: {
    backgroundColor: '#2196F3',
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckSymptomsScreen;
