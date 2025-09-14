import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const translations = {
  en: {
    symptomsTitle: "Describe Your Symptoms",
    symptomsDesc: "Please provide details about your health concerns",
    describeSymptomsLabel: "Describe your symptoms",
    symptomsPlaceholder: "Please describe what you're feeling, when it started, and any other relevant details...",
    durationLabel: "How long have you been experiencing these symptoms?",
    severityLabel: "Rate the severity (1-10)",
    commonSymptoms: "Common Symptoms",
    medicalHistory: "Medical History",
    currentMedications: "Current Medications",
    medicationsPlaceholder: "List any medications you're currently taking...",
    allergies: "Known Allergies",
    allergiesPlaceholder: "List any allergies to medications or foods...",
    continue: "Continue",
    selectDuration: "Select Duration",
    durations: {
      "1-day": "1 Day",
      "2-7-days": "2-7 Days", 
      "1-2-weeks": "1-2 Weeks",
      "2-4-weeks": "2-4 Weeks",
      "1-3-months": "1-3 Months",
      "3-months-plus": "More than 3 Months"
    },
    commonSymptomsOptions: [
      "Fever", "Headache", "Cough", "Cold", "Body Pain", "Nausea", "Fatigue", "Dizziness"
    ],
    medicalHistoryOptions: [
      "Diabetes", "High Blood Pressure", "Heart Disease", "Asthma", "Thyroid", "Kidney Disease"
    ]
  },
  hi: {
    symptomsTitle: "अपने लक्षणों का वर्णन करें",
    symptomsDesc: "कृपया अपनी स्वास्थ्य समस्याओं के बारे में जानकारी दें",
    describeSymptomsLabel: "अपने लक्षणों का वर्णन करें",
    symptomsPlaceholder: "कृपया बताएं कि आप कैसा महसूस कर रहे हैं, यह कब शुरू हुआ, और अन्य संबंधित जानकारी...",
    durationLabel: "आप कितने समय से इन लक्षणों का अनुभव कर रहे हैं?",
    severityLabel: "गंभीरता दर्जा दें (1-10)",
    commonSymptoms: "सामान्य लक्षण",
    medicalHistory: "चिकित्सा इतिहास",
    currentMedications: "वर्तमान दवाएं",
    medicationsPlaceholder: "वे दवाएं सूचीबद्ध करें जो आप वर्तमान में ले रहे हैं...",
    allergies: "ज्ञात एलर्जी",
    allergiesPlaceholder: "दवाओं या खाद्य पदार्थों से होने वाली एलर्जी की सूची...",
    continue: "जारी रखें",
    selectDuration: "अवधि चुनें",
    durations: {
      "1-day": "1 दिन",
      "2-7-days": "2-7 दिन",
      "1-2-weeks": "1-2 सप्ताह", 
      "2-4-weeks": "2-4 सप्ताह",
      "1-3-months": "1-3 महीने",
      "3-months-plus": "3 महीने से अधिक"
    },
    commonSymptomsOptions: [
      "बुखार", "सिरदर्द", "खांसी", "सर्दी", "शरीर दर्द", "मतली", "थकान", "चक्कर"
    ],
    medicalHistoryOptions: [
      "मधुमेह", "उच्च रक्तचाप", "हृदय रोग", "दमा", "थायराइड", "गुर्दे की बीमारी"
    ]
  },
  pa: {
    symptomsTitle: "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
    symptomsDesc: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿਓ",
    describeSymptomsLabel: "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
    symptomsPlaceholder: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ, ਇਹ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਇਆ, ਅਤੇ ਹੋਰ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ...",
    durationLabel: "ਤੁਸੀਂ ਕਿੰਨੇ ਸਮੇਂ ਤੋਂ ਇਨ੍ਹਾਂ ਲੱਛਣਾਂ ਦਾ ਅਨੁਭਵ ਕਰ ਰਹੇ ਹੋ?",
    severityLabel: "ਗੰਭੀਰਤਾ ਦਰਜਾ ਦਿਓ (1-10)",
    commonSymptoms: "ਆਮ ਲੱਛਣ",
    medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    currentMedications: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ",
    medicationsPlaceholder: "ਉਹ ਦਵਾਈਆਂ ਸੂਚੀਬੱਧ ਕਰੋ ਜੋ ਤੁਸੀਂ ਵਰਤਮਾਨ ਵਿੱਚ ਲੈ ਰਹੇ ਹੋ...",
    allergies: "ਜਾਣੀਆਂ ਐਲਰਜੀਆਂ",
    allergiesPlaceholder: "ਦਵਾਈਆਂ ਜਾਂ ਭੋਜਨ ਤੋਂ ਹੋਣ ਵਾਲੀਆਂ ਐਲਰਜੀਆਂ ਦੀ ਸੂਚੀ...",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    selectDuration: "ਮਿਆਦ ਚੁਣੋ",
    durations: {
      "1-day": "1 ਦਿਨ",
      "2-7-days": "2-7 ਦਿਨ",
      "1-2-weeks": "1-2 ਹਫ਼ਤੇ",
      "2-4-weeks": "2-4 ਹਫ਼ਤੇ", 
      "1-3-months": "1-3 ਮਹੀਨੇ",
      "3-months-plus": "3 ਮਹੀਨਿਆਂ ਤੋਂ ਜ਼ਿਆਦਾ"
    },
    commonSymptomsOptions: [
      "ਬੁਖਾਰ", "ਸਿਰ ਦਰਦ", "ਖੰਘ", "ਸਰਦੀ", "ਸਰੀਰ ਦਰਦ", "ਜੀ ਮਿਚਲਾਉਣਾ", "ਥਕਾਵਟ", "ਚੱਕਰ"
    ],
    medicalHistoryOptions: [
      "ਡਾਇਬੀਟੀਜ਼", "ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ", "ਦਿਲ ਦੀ ਬਿਮਾਰੀ", "ਦਮਾ", "ਥਾਇਰਾਇਡ", "ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ"
    ]
  }
};

const SymptomsForm = ({ language = 'en', symptomsData = {}, onSubmit }) => {
  const [symptoms, setSymptoms] = useState(symptomsData.description || '');
  const [duration, setDuration] = useState(symptomsData.duration || '');
  const [severity, setSeverity] = useState(symptomsData.severity || 5);
  const [selectedCommonSymptoms, setSelectedCommonSymptoms] = useState(symptomsData.commonSymptoms || []);
  const [medicalHistory, setMedicalHistory] = useState(symptomsData.medicalHistory || []);
  const [medications, setMedications] = useState(symptomsData.medications || '');
  const [allergies, setAllergies] = useState(symptomsData.allergies || '');
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const t = translations[language];

  const toggleCommonSymptom = (symptom) => {
    setSelectedCommonSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const toggleMedicalHistory = (condition) => {
    setMedicalHistory(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSubmit = () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please describe your symptoms');
      return;
    }

    const symptomsFormData = {
      description: symptoms,
      duration,
      severity,
      commonSymptoms: selectedCommonSymptoms,
      medicalHistory,
      medications,
      allergies
    };

    onSubmit(symptomsFormData);
  };

  const renderSeveritySlider = () => (
    <View style={styles.severityContainer}>
      <Text style={styles.label}>{t.severityLabel}</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.severityNumbers}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.severityButton,
                severity === num && styles.selectedSeverity
              ]}
              onPress={() => setSeverity(num)}
            >
              <Text style={[
                styles.severityText,
                severity === num && styles.selectedSeverityText
              ]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.severityLabels}>
          <Text style={styles.severityLabel}>Mild</Text>
          <Text style={styles.severityLabel}>Severe</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.symptomsTitle}</Text>
        <Text style={styles.subtitle}>{t.symptomsDesc}</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Symptoms Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.describeSymptomsLabel}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={t.symptomsPlaceholder}
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Duration Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.durationLabel}</Text>
          <TouchableOpacity
            style={styles.durationSelector}
            onPress={() => setShowDurationPicker(!showDurationPicker)}
          >
            <Text style={styles.durationText}>
              {duration ? t.durations[duration] : t.selectDuration}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          
          {showDurationPicker && (
            <View style={styles.durationOptions}>
              {Object.entries(t.durations).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.durationOption}
                  onPress={() => {
                    setDuration(key);
                    setShowDurationPicker(false);
                  }}
                >
                  <Text style={styles.durationOptionText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Severity Slider */}
        {renderSeveritySlider()}

        {/* Common Symptoms */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.commonSymptoms}</Text>
          <View style={styles.optionsGrid}>
            {t.commonSymptomsOptions.map((symptom) => (
              <TouchableOpacity
                key={symptom}
                style={[
                  styles.optionButton,
                  selectedCommonSymptoms.includes(symptom) && styles.selectedOption
                ]}
                onPress={() => toggleCommonSymptom(symptom)}
              >
                <Text style={[
                  styles.optionText,
                  selectedCommonSymptoms.includes(symptom) && styles.selectedOptionText
                ]}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.medicalHistory}</Text>
          <View style={styles.optionsGrid}>
            {t.medicalHistoryOptions.map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.optionButton,
                  medicalHistory.includes(condition) && styles.selectedOption
                ]}
                onPress={() => toggleMedicalHistory(condition)}
              >
                <Text style={[
                  styles.optionText,
                  medicalHistory.includes(condition) && styles.selectedOptionText
                ]}>
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Medications */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.currentMedications}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t.medicationsPlaceholder}
            value={medications}
            onChangeText={setMedications}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Allergies */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t.allergies}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t.allergiesPlaceholder}
            value={allergies}
            onChangeText={setAllergies}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t.continue}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 120,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 80,
  },
  durationSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    color: '#212529',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6c757d',
  },
  durationOptions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  durationOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#212529',
  },
  severityContainer: {
    marginBottom: 25,
  },
  sliderContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  severityNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  severityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedSeverity: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  selectedSeverityText: {
    color: '#fff',
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  optionText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4facfe',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SymptomsForm;
